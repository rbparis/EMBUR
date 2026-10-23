import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

function jsx(path: string, name: string) {
  const text = readFileSync(path, "utf8");
  const root = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const matches: ts.Node[] = [];
  function visit(n: ts.Node) {
    if ((ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n)) && n.tagName.getText() === name) matches.push(n);
    ts.forEachChild(n, visit);
  }
  visit(root); return { text, matches };
}

test("signed-in client shell renders Account with the real Clerk UserButton on every page", () => {
  const route = readFileSync("app/app/page.tsx", "utf8");
  assert.match(route, /await auth\(\)/);
  assert.match(route, /getFounderContext/);
  assert.ok(jsx("app/app/page.tsx", "AppShellPreview").matches.length > 0);
  assert.ok(jsx("components/app/AppShellPreview.tsx", "AppHeader").matches.length > 0);
  for (const path of ["components/app/AppHeader.tsx", "app/app/onboarding/page.tsx"]) {
    const { text, matches } = jsx(path, "WorkspaceAccountControls");
    assert.equal(matches.length, 1, path);
    assert.match(text, />Account<\/span>/);
    let parent = matches[0].parent;
    while (parent && !ts.isReturnStatement(parent)) {
      assert.ok(!ts.isConditionalExpression(parent), `${path}: control must not depend on page selection`);
      assert.ok(!(ts.isBinaryExpression(parent) && parent.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken));
      parent = parent.parent;
    }
    assert.ok(!/hidden[^"\n]*Account/.test(text));
  }
  const { text, matches } = jsx("components/app/WorkspaceAccountControls.tsx", "UserButton");
  assert.match(text, /import \{ UserButton \} from "@clerk\/nextjs"/);
  assert.equal(matches.length, 1);
});
