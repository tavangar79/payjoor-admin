// Posts from trusted pages that the AI gate held for a person, plus jobs that gave up (PRD §6, §9.2.1).
// The model's suggestion pre-fills the form, but outcome and direction stay required: a "none" suggestion leaves them empty.
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { BadgeDollarSign, Bot, Check, ExternalLink, ImageOff, Loader2, Plus, PlayCircle, RotateCw, Search, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { EmptyState, ErrorState, Field, Handle, Ltr, LoadingRows, PageHeader, Pagination, Panel, Segmented } from '@/components/common';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/components/toast';
import { get, post, qs } from '@/lib/api';
import { DIRECTION_LABELS, OUTCOME_LABELS, errorMessage, fmtAgo, fmtDateTime, holdReasonLabel, num } from '@/lib/labels';
import { DIRECTIONS, OUTCOMES, type Direction, type Outcome, type Paged, type PostCheck, type Shop } from '@/lib/types';
import { useAsync } from '@/lib/useAsync';
import { cn } from '@/lib/utils';

const LIMIT = 20;
const TABS = ['needs_person', 'failed'] as const;
type Tab = (typeof TABS)[number];
const TAB_LABELS: Record<Tab, string> = { needs_person: 'نیازمند بررسی', failed: 'ناموفق' };

type ShopPick = Pick<Shop, '_id' | 'displayName' | 'handle'>;

export function PostChecks() {
  const [params, setParams] = useSearchParams();
  const tab: Tab = params.get('status') === 'failed' ? 'failed' : 'needs_person';
  const page = Math.max(1, Number(params.get('page')) || 1);
  const list = useAsync(() => get<Paged<PostCheck>>(`/post-checks${qs({ status: tab, page, limit: LIMIT })}`), [tab, page]);

  function setQuery(next: { status?: Tab; page?: number }) {
    const p = new URLSearchParams(params);
    if (next.status) p.set('status', next.status);
    if (next.page) p.set('page', String(next.page));
    else p.delete('page');
    setParams(p);
  }

  function removeItem(id: string) {
    list.setData((prev) => prev && { ...prev, items: prev.items.filter((c) => c._id !== id), total: prev.total - 1 });
  }

  return (
    <>
      <PageHeader
        title="پست‌های نیازمند بررسی"
        description="پست‌های پیج‌های مورد اعتماد که هوش مصنوعی نتوانست خودکار منتشرشان کند. پیشنهاد مدل از پیش وارد فرم شده است، اما نتیجه و جهت نقد را خودتان تأیید کنید."
      />
      <Segmented
        label="وضعیت پست"
        value={tab}
        onChange={(s) => setQuery({ status: s })}
        options={TABS.map((t) => ({
          value: t,
          label: (
            <>
              {TAB_LABELS[t]}
              {t === tab && list.data && <span className="ms-1.5 text-ink-3">{num(list.data.total)}</span>}
            </>
          ),
        }))}
      />

      {list.loading && !list.data ? (
        <Panel>
          <LoadingRows rows={4} />
        </Panel>
      ) : list.error ? (
        <Panel>
          <ErrorState error={list.error} onRetry={list.reload} />
        </Panel>
      ) : !list.data?.items.length ? (
        <Panel>
          <EmptyState title={tab === 'needs_person' ? 'پستی منتظر بررسی نیست' : 'پست ناموفقی نیست'}>
            {tab === 'needs_person'
              ? 'پست‌هایی که مدل با اطمینان کافی تأیید کند خودکار منتشر می‌شوند و اینجا نمی‌آیند.'
              : 'پست‌هایی که تحلیل یا انتشارشان خطا داده باشد اینجا فهرست می‌شوند.'}
          </EmptyState>
        </Panel>
      ) : (
        <div className={cn('flex flex-col gap-4', list.loading && 'opacity-60')} aria-busy={list.loading}>
          {list.data.items.map((check) => (
            <CheckCard key={check._id} check={check} onDone={() => removeItem(check._id)} />
          ))}
          {list.data.total > LIMIT && (
            <Panel>
              <Pagination page={page} limit={LIMIT} total={list.data.total} onPage={(p) => setQuery({ page: p })} />
            </Panel>
          )}
        </div>
      )}
    </>
  );
}

function Thumb({ check }: { check: PostCheck }) {
  const [broken, setBroken] = useState(false);
  const src = check.media?.displayUrl;
  return (
    <a
      href={check.postUrl}
      target="_blank"
      rel="noreferrer noopener"
      className="relative block size-28 shrink-0 overflow-hidden rounded-xl border border-line bg-subtle sm:size-32"
      aria-label="باز کردن پست در اینستاگرام"
    >
      {src && !broken ? (
        <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" className="size-full object-cover" onError={() => setBroken(true)} />
      ) : (
        <span className="grid size-full place-items-center text-ink-3">
          <ImageOff className="size-6" aria-hidden="true" />
          <span className="sr-only">تصویر در دسترس نیست</span>
        </span>
      )}
      {check.media?.videoUrl && (
        <span className="absolute end-1.5 bottom-1.5 grid size-7 place-items-center rounded-full bg-ink/70 text-surface">
          <PlayCircle className="size-4" aria-hidden="true" />
          <span className="sr-only">ویدیو</span>
        </span>
      )}
    </a>
  );
}

function Caption({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  if (!text.trim()) return <p className="text-sm text-ink-3">بدون کپشن</p>;
  const long = text.length > 280 || text.split('\n').length > 4;
  return (
    <div className="flex flex-col items-start gap-1">
      <p dir="auto" className={cn('text-sm leading-7 whitespace-pre-line text-ink-2', !open && long && 'line-clamp-4')}>
        {text}
      </p>
      {long && (
        <button type="button" className="text-xs font-medium text-brand hover:underline" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? 'نمایش کمتر' : 'نمایش کامل کپشن'}
        </button>
      )}
    </div>
  );
}

/** The model's suggestion, shown as plain facts; the gate's reasons say why it was not enough. */
function Suggestion({ check }: { check: PostCheck }) {
  const a = check.analysis;
  if (!a) return <p className="text-sm text-ink-3">تحلیلی از مدل ثبت نشده است.</p>;
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-line bg-subtle px-4 py-3 text-sm">
      <p className="flex items-center gap-1.5 font-medium text-ink-2">
        <Bot className="size-4" aria-hidden="true" />
        پیشنهاد مدل
        <span className="text-xs font-normal text-ink-3">· اطمینان {num(Math.round(a.confidence * 100))}٪</span>
      </p>
      <div className="flex flex-wrap items-center gap-1.5 text-ink-2">
        <span>{a.isReview ? 'نقد است' : 'نقد نیست'}</span>
        {a.outcome !== 'none' && <Badge variant="secondary">{OUTCOME_LABELS[a.outcome]}</Badge>}
        {a.direction !== 'none' && <Badge variant="secondary">{DIRECTION_LABELS[a.direction]}</Badge>}
        {a.scamClaim && <Badge variant="danger">ادعای کلاهبرداری</Badge>}
        {a.shops.map((s) => (
          <span key={s.handle} className="inline-flex items-center gap-1">
            <Handle handle={s.handle} link={false} className="text-xs" />
            {s.role === 'other' && <span className="text-xs text-ink-3">(غیرفروشگاه)</span>}
          </span>
        ))}
      </div>
      {a.summary && <p className="text-ink-3">«{a.summary}»</p>}
    </div>
  );
}

function CheckCard({ check, onDone }: { check: PostCheck; onDone: () => void }) {
  const toast = useToast();
  const a = check.analysis;
  const [outcome, setOutcome] = useState<Outcome | undefined>(a && a.outcome !== 'none' ? a.outcome : undefined);
  const [direction, setDirection] = useState<Direction | undefined>(a && a.direction !== 'none' ? a.direction : undefined);
  const [summary, setSummary] = useState(a?.summary ?? '');
  const [scamClaim, setScamClaim] = useState(a?.scamClaim ?? false);
  const [shops, setShops] = useState<ShopPick[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [rerunning, setRerunning] = useState(false);
  const [dismissOpen, setDismissOpen] = useState(false);
  const [showMissing, setShowMissing] = useState(false);

  const idBase = `check-${check._id}`;
  const suggested = Array.from(
    new Set([...(a?.shops.filter((s) => s.role === 'reviewed_shop').map((s) => s.handle) ?? []), ...check.tagged]),
  );
  const busy = publishing || rerunning;
  // The backend only reruns jobs that gave up (the failed tab); a held post answers 409 not_rerunnable.
  const rerunnable = (check.status === 'queued' || check.status === 'classified') && Boolean(check.lastError);

  async function publish() {
    if (!outcome || !direction || !shops.length) {
      setShowMissing(true);
      return;
    }
    setPublishing(true);
    try {
      await post(`/post-checks/${check._id}/publish`, {
        shopIds: shops.map((s) => s._id),
        outcome,
        direction,
        summary: summary.trim() || undefined,
        scamClaim,
      });
      toast.success('نقد منتشر شد.');
      onDone();
    } catch (err) {
      toast.error(errorMessage(err));
      setPublishing(false);
    }
  }

  async function dismiss() {
    try {
      await post(`/post-checks/${check._id}/dismiss`);
    } catch (err) {
      toast.error(errorMessage(err));
      throw err;
    }
    toast.success('پست کنار گذاشته شد.');
    onDone();
  }

  async function rerun() {
    setRerunning(true);
    try {
      await post(`/post-checks/${check._id}/rerun`);
      toast.success('پست دوباره در صف تحلیل قرار گرفت.');
      onDone();
    } catch (err) {
      toast.error(errorMessage(err));
      setRerunning(false);
    }
  }

  return (
    <article
      aria-labelledby={`${idBase}-title`}
      className={cn('rounded-2xl border bg-surface shadow-card', check.paidPartnership ? 'border-warn-line' : 'border-line')}
    >
      {check.paidPartnership && (
        <div className="flex items-center gap-2 rounded-t-2xl border-b border-warn-line bg-warn-soft px-5 py-2.5 text-sm font-medium text-warn">
          <BadgeDollarSign className="size-4 shrink-0" aria-hidden="true" />
          همکاری پولی (Paid partnership): این پست تبلیغاتی است. پیش از انتشار با دقت بیشتری بررسی کنید.
        </div>
      )}
      <div className="flex flex-col gap-5 p-5 md:flex-row">
        <Thumb check={check} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-1">
              <h2 id={`${idBase}-title`} className="text-sm font-semibold text-ink">
                پست {check.reviewerSourceId?.name ?? 'پیج نامعلوم'}
              </h2>
              <p className="flex flex-wrap items-center gap-x-1.5 text-xs text-ink-3">
                {check.reviewerSourceId && <Handle handle={check.reviewerSourceId.handle} />}
                <span aria-hidden="true">·</span>
                <time dateTime={check.occurredAt} title={fmtDateTime(check.occurredAt)}>
                  {fmtAgo(check.occurredAt)}
                </time>
              </p>
            </div>
            <a
              href={check.postUrl}
              target="_blank"
              rel="noreferrer noopener"
              dir="ltr"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand underline-offset-4 hover:underline"
            >
              <ExternalLink className="size-3.5" aria-hidden="true" />
              instagram.com/p/{check.postShortcode}
            </a>
          </div>

          <Caption text={check.caption} />

          {check.reasons.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-ink-3">دلیل نگه‌داشتن:</span>
              {check.reasons.map((r) => (
                <Badge key={r} variant="caution">
                  {holdReasonLabel(r)}
                </Badge>
              ))}
            </div>
          )}

          <Suggestion check={check} />

          {check.lastError && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-subtle px-4 py-3 text-sm">
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="font-medium text-ink-2">پردازش این پست متوقف شد</span>
                <Ltr className="max-w-full truncate text-xs text-ink-3">{check.lastError}</Ltr>
              </div>
              {rerunnable && (
                <Button variant="outline" size="sm" onClick={rerun} disabled={busy}>
                  {rerunning ? <Loader2 className="animate-spin" aria-hidden="true" /> : <RotateCw aria-hidden="true" />}
                  اجرای دوباره
                </Button>
              )}
            </div>
          )}

          <div className="flex flex-col gap-4 border-t border-line pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label={
                  <>
                    نتیجه برای خریدار <span className="text-danger">*</span>
                  </>
                }
                htmlFor={`${idBase}-outcome`}
                error={showMissing && !outcome ? 'نتیجه را انتخاب کنید.' : null}
              >
                <Select dir="rtl" value={outcome} onValueChange={(v) => setOutcome(v as Outcome)}>
                  <SelectTrigger id={`${idBase}-outcome`} className="w-full" aria-required="true">
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    {OUTCOMES.map((o) => (
                      <SelectItem key={o} value={o}>
                        {OUTCOME_LABELS[o]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink-2">
                  جهت نقد <span className="text-danger">*</span>
                </span>
                <Segmented
                  label="جهت نقد"
                  value={direction}
                  onChange={setDirection}
                  options={DIRECTIONS.map((d) => ({ value: d, label: DIRECTION_LABELS[d] }))}
                />
                {showMissing && !direction && (
                  <p role="alert" className="text-xs text-danger">
                    جهت نقد را انتخاب کنید.
                  </p>
                )}
              </div>
            </div>
            <Field label="خلاصهٔ یک‌خطی (اختیاری)" htmlFor={`${idBase}-summary`} hint="در پاسخ دایرکت نشان داده می‌شود. حداکثر ۲۰۰ نویسه.">
              <Input id={`${idBase}-summary`} maxLength={200} value={summary} onChange={(e) => setSummary(e.target.value)} />
            </Field>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink-2">
                فروشگاه <span className="text-danger">*</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {shops.map((s) => (
                  <Badge key={s._id} variant="default" className="gap-1.5 ps-2.5 pe-1">
                    {s.displayName}
                    <Ltr className="text-xs">@{s.handle}</Ltr>
                    <button
                      type="button"
                      aria-label={`برداشتن ${s.displayName}`}
                      className="grid size-5 place-items-center rounded-full hover:bg-brand-line"
                      onClick={() => setShops((cur) => cur.filter((x) => x._id !== s._id))}
                    >
                      <X className="size-3" aria-hidden="true" />
                    </button>
                  </Badge>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
                  <Plus aria-hidden="true" />
                  {shops.length ? 'افزودن فروشگاه' : 'انتخاب فروشگاه'}
                </Button>
              </div>
              {suggested.length > 0 && (
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-3">
                  <span>فروشگاه هنوز ساخته نشده؟ بسازید:</span>
                  {suggested.map((h) => (
                    <Link
                      key={h}
                      to={`/shops/new?handle=${encodeURIComponent(h)}`}
                      target="_blank"
                      rel="noreferrer"
                      dir="ltr"
                      className="font-medium text-brand underline-offset-4 hover:underline"
                    >
                      @{h}
                    </Link>
                  ))}
                </p>
              )}
              {showMissing && !shops.length && (
                <p role="alert" className="text-xs text-danger">
                  دست‌کم یک فروشگاه انتخاب کنید.
                </p>
              )}
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-line px-4 py-3">
              <Switch id={`${idBase}-scam`} checked={scamClaim} onCheckedChange={setScamClaim} aria-describedby={`${idBase}-scam-hint`} />
              <div className="flex flex-col gap-0.5">
                <label htmlFor={`${idBase}-scam`} className="text-sm font-medium text-ink-2">
                  ادعای کلاهبرداری
                </label>
                <p id={`${idBase}-scam-hint`} className="text-xs leading-5 text-ink-3">
                  با روشن بودن، برچسب «scammer» به‌صورت عمومی به فروشگاه (یا فروشگاه‌های) انتخاب‌شده اضافه می‌شود. فقط وقتی روشن کنید
                  که پست به‌روشنی کلاهبرداری را گزارش می‌کند.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={publish} disabled={busy}>
                {publishing ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Check aria-hidden="true" />}
                تأیید و انتشار
              </Button>
              <Button variant="outline" className="text-danger" onClick={() => setDismissOpen(true)} disabled={busy}>
                <X aria-hidden="true" />
                کنار گذاشتن
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ShopPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        initialQuery={suggested[0] ?? ''}
        selected={shops}
        onToggle={(shop) =>
          setShops((cur) => (cur.some((s) => s._id === shop._id) ? cur.filter((s) => s._id !== shop._id) : [...cur, shop]))
        }
      />
      <ConfirmDialog
        open={dismissOpen}
        onOpenChange={setDismissOpen}
        title="این پست کنار گذاشته شود؟"
        description="از این پست نقدی منتشر نمی‌شود و دوباره در این فهرست نمی‌آید."
        confirmLabel="کنار بگذار"
        onConfirm={dismiss}
      />
    </article>
  );
}

function ShopPicker({
  open,
  onClose,
  initialQuery,
  selected,
  onToggle,
}: {
  open: boolean;
  onClose: () => void;
  initialQuery: string;
  selected: ShopPick[];
  onToggle: (shop: ShopPick) => void;
}) {
  const [q, setQ] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const results = useAsync(
    () => (open ? get<Paged<Shop>>(`/shops${qs({ q: query, limit: 8 })}`) : Promise.resolve(undefined)),
    [open, query],
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent dir="rtl" className="gap-4">
        <DialogHeader className="text-start">
          <DialogTitle className="text-ink">انتخاب فروشگاه</DialogTitle>
          <DialogDescription className="leading-6 text-ink-3">
            یک یا چند فروشگاه را انتخاب کنید؛ نقد برای همهٔ آن‌ها منتشر می‌شود.
          </DialogDescription>
        </DialogHeader>
        <form
          role="search"
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(q.trim());
          }}
        >
          <label htmlFor="pick-shop-q" className="sr-only">
            جست‌وجوی فروشگاه
          </label>
          <Input id="pick-shop-q" dir="auto" placeholder="نام یا شناسهٔ فروشگاه" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
          <Button type="submit" variant="outline" size="icon" aria-label="جست‌وجو">
            <Search aria-hidden="true" />
          </Button>
        </form>
        <div className="max-h-80 overflow-y-auto rounded-xl border border-line">
          {results.loading ? (
            <LoadingRows rows={3} />
          ) : results.error ? (
            <ErrorState error={results.error} onRetry={results.reload} />
          ) : !results.data?.items.length ? (
            <EmptyState title="فروشگاهی پیدا نشد">اگر فروشگاه ساخته نشده، از پیوند «بسازید» زیر فرم استفاده کنید.</EmptyState>
          ) : (
            <ul className="divide-y divide-line">
              {results.data.items.map((shop) => {
                const on = selected.some((s) => s._id === shop._id);
                return (
                  <li key={shop._id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-medium text-ink">{shop.displayName}</span>
                      <Handle handle={shop.handle} link={false} className="text-xs text-ink-3" />
                    </div>
                    <Button size="sm" variant={on ? 'default' : 'outline'} aria-pressed={on} onClick={() => onToggle(shop)}>
                      {on && <Check aria-hidden="true" />}
                      {on ? 'انتخاب شد' : 'انتخاب'}
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <Button onClick={onClose}>تمام</Button>
      </DialogContent>
    </Dialog>
  );
}
