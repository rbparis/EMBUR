"use client";

import { useMemo, useState } from "react";
import EmburIcon from "@/components/ui/EmburIcon";
import type { ConversationThread } from "@/services/conversationApi";

type ConversationsPageProps = {
  threads: ConversationThread[];
  status: "loading" | "database" | "error";
  onRetry: () => void;
};

export default function ConversationsPage({
  threads,
  status,
  onRetry,
}: ConversationsPageProps) {
  const [selectedThreadId, setSelectedThreadId] =
    useState<string | null>(null);

  const effectiveSelectedThreadId = useMemo(() => {
    if (threads.length === 0) {
      return null;
    }

    const selectedStillExists = threads.some(
      (thread) => thread.id === selectedThreadId
    );

    if (selectedStillExists) {
      return selectedThreadId;
    }

    return threads[0].id;
  }, [threads, selectedThreadId]);

  const selectedThread = useMemo(
    () =>
      threads.find(
        (thread) =>
          thread.id === effectiveSelectedThreadId
      ) ?? null,
    [threads, effectiveSelectedThreadId]
  );

  if (status === "loading") {
    return <ConversationLoading />;
  }

  if (status === "error") {
    return <ConversationError onRetry={onRetry} />;
  }

  if (threads.length === 0) {
    return <ConversationEmpty />;
  }

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      <div className="grid min-h-[620px] lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="border-b border-slate-200 bg-slate-50 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-200 p-5 md:p-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
              Calls and messages
            </p>

            <div className="mt-3 flex items-end justify-between gap-4">
              <h3 className="text-2xl font-bold tracking-tight text-slate-950">
                Call desk
              </h3>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                {threads.length} active
              </span>
            </div>
          </div>

          <div className="max-h-[560px] overflow-y-auto p-3">
            {threads.map((thread) => {
              const isSelected =
                thread.id === effectiveSelectedThreadId;

              return (
                <button
                  type="button"
                  key={thread.id}
                  onClick={() =>
                    setSelectedThreadId(thread.id)
                  }
                  className={`mb-2 w-full rounded-2xl border p-4 text-left transition-all duration-200 last:mb-0 ${
                    isSelected
                      ? "border-blue-200 bg-white shadow-md"
                      : "border-transparent bg-transparent hover:border-slate-200 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {thread.needsAttention && (
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500"
                            aria-label="Needs attention"
                          />
                        )}

                        <p className="truncate font-bold text-slate-950">
                          {thread.customerName}
                        </p>
                      </div>

                      <p className="mt-1 truncate text-sm font-medium text-slate-500">
                        {thread.service}
                      </p>
                    </div>

                    <p className="shrink-0 text-xs font-semibold text-slate-400">
                      {thread.lastActivity}
                    </p>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {thread.preview}
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0 bg-white">
          {selectedThread ? (
            <ConversationThreadView
              thread={selectedThread}
            />
          ) : (
            <ConversationEmpty />
          )}
        </div>
      </div>
    </section>
  );
}

function ConversationThreadView({
  thread,
}: {
  thread: ConversationThread;
}) {
  return (
    <div className="flex h-full min-h-[620px] flex-col">
      <header className="border-b border-slate-200 px-5 py-5 md:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <EmburIcon
                name="customers"
                size={21}
              />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-950">
                {thread.customerName}
              </h3>

              <p className="mt-0.5 text-sm text-slate-500">
                {thread.service}
                {thread.phone
                  ? ` · ${thread.phone}`
                  : ""}
              </p>
            </div>
          </div>

          <ConversationStatus
            needsAttention={thread.needsAttention}
            customerStatus={thread.customerStatus}
          />
        </div>
      </header>

      <div className="flex-1 space-y-5 bg-slate-50 px-5 py-7 md:px-7">
        {thread.messages.map((message) => {
          const isOutbound =
            message.direction === "outbound";

          return (
            <div
              key={message.id}
              className={`flex ${
                isOutbound
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[88%] rounded-3xl px-5 py-4 shadow-sm md:max-w-[72%] ${
                  isOutbound
                    ? "rounded-br-lg bg-blue-600 text-white"
                    : "rounded-bl-lg border border-slate-200 bg-white text-slate-800"
                }`}
              >
                <p className="text-sm leading-relaxed md:text-base">
                  {message.body}
                </p>

                <div
                  className={`mt-3 flex flex-wrap items-center gap-2 text-xs font-medium ${
                    isOutbound
                      ? "text-blue-100"
                      : "text-slate-400"
                  }`}
                >
                  <span>
                    {isOutbound
                      ? "EMBUR"
                      : thread.customerName}
                  </span>

                  <span>·</span>

                  <span>{message.time}</span>

                  {isOutbound && (
                    <>
                      <span>·</span>

                      <span className="capitalize">
                        {message.status}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="border-t border-slate-200 bg-white p-5 md:p-6">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
            EMBUR is connected
          </p>

          <p className="mt-2 text-sm leading-relaxed text-blue-900">
            Live replies and suggested responses will be
            enabled when messaging is connected. This
            thread is currently read-only.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ConversationStatus({
  needsAttention,
  customerStatus,
}: {
  needsAttention: boolean;
  customerStatus: string;
}) {
  if (needsAttention) {
    return (
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-800">
        <span className="h-2 w-2 rounded-full bg-orange-500" />
        Needs attention
      </span>
    );
  }

  return (
    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-800">
      <span className="h-2 w-2 rounded-full bg-green-500" />
      {customerStatus}
    </span>
  );
}

function ConversationLoading() {
  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="grid min-h-[560px] lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-3 border-b border-slate-200 bg-slate-50 p-5 lg:border-b-0 lg:border-r">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-slate-200/70"
            />
          ))}
        </div>

        <div className="flex items-center justify-center p-8 text-center">
          <div>
            <div className="mx-auto h-12 w-12 animate-pulse rounded-2xl bg-blue-100" />

            <p className="mt-5 font-bold text-slate-700">
              Loading conversations...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConversationError({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <section className="mt-8 flex min-h-96 items-center justify-center rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
      <div className="max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-700">
          <EmburIcon
            name="conversations"
            size={26}
          />
        </div>

        <h3 className="mt-5 text-2xl font-bold text-slate-950">
          Conversations could not be loaded.
        </h3>

        <p className="mt-3 leading-relaxed text-slate-500">
          EMBUR could not reach the conversation database.
          Your customer data is safe.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}

function ConversationEmpty() {
  return (
    <section className="flex min-h-96 items-center justify-center p-8 text-center">
      <div className="max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <EmburIcon
            name="conversations"
            size={26}
          />
        </div>

        <h3 className="mt-5 text-2xl font-bold text-slate-950">
          You&apos;re all caught up.
        </h3>

        <p className="mt-3 leading-relaxed text-slate-500">
          New customer conversations will appear here
          automatically when EMBUR begins responding.
        </p>
      </div>
    </section>
  );
}
