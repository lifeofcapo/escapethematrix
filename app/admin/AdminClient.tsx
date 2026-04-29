"use client";

import { useState, useEffect, useCallback } from "react";

interface Subscription {
  id: number;
  plan: string;
  region: string;
  devices_limit: number;
  xui_email: string | null;
  started_at: string | null;
  expires_at: string | null;
  is_active: boolean;
}

interface User {
  id: number;
  username: string | null;
  full_name: string | null;
  language: string;
  balance: number;
  referred_by: number | null;
  created_at: string;
  subscriptions: Subscription[];
}

interface Payment {
  id: number;
  user_id: number;
  amount: string;
  currency: string;
  provider: string | null;
  provider_id: string | null;
  purpose: string | null;
  status: string;
  created_at: string;
  paid_at: string | null;
  username: string | null;
  full_name: string | null;
}

interface FinanceData {
  total_paid: number;
  paid_count: number;
  active_subs: number;
  total_users: number;
  monthly: { month: string; amount: number; count: number }[];
}

type Tab = "users" | "payments" | "finance";

function fmt(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function fmtMoney(n: number) {
  return n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function api(path: string, opts?: RequestInit) {
  const res = await fetch(path, { credentials: "include", ...opts });
  if (res.status === 401) throw new Error("UNAUTH");
  return res;
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      if (res.ok) {
        onLogin();
      } else {
        setError("Неверный логин или пароль");
      }
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-[10px] font-mono tracking-[0.5em] text-green-400/50 uppercase mb-2">
            ◈ escape the matrix
          </div>
          <div className="text-white/60 font-mono text-lg tracking-widest uppercase">
            Панель управления
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/8 rounded-sm p-6 flex flex-col gap-4">
          <div>
            <label className="text-white/30 font-mono text-[10px] tracking-widest uppercase block mb-1">Логин</label>
            <input
              type="text"
              value={login}
              onChange={e => setLogin(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-sm px-3 py-2.5 text-white/80 font-mono text-sm focus:outline-none focus:border-green-400/40 transition-colors"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-white/30 font-mono text-[10px] tracking-widest uppercase block mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-sm px-3 py-2.5 text-white/80 font-mono text-sm focus:outline-none focus:border-green-400/40 transition-colors"
              autoComplete="current-password"
            />
          </div>
          {error && (
            <div className="text-red-400/70 font-mono text-xs border border-red-400/20 px-3 py-2 rounded-sm bg-red-400/5">
              ⊗ {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 bg-green-400/10 border border-green-400/30 text-green-400 font-mono text-xs tracking-widest uppercase hover:bg-green-400/15 hover:border-green-400/50 transition-all rounded-sm disabled:opacity-50"
          >
            {loading ? "Проверка..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] font-mono text-xs px-5 py-3 rounded-sm border ${ok ? "bg-green-400/10 border-green-400/30 text-green-400" : "bg-red-400/10 border-red-400/30 text-red-400"}`}>
      {ok ? "✓" : "⊗"} {msg}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-sm shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="font-mono text-sm text-white/60 tracking-wider">{title}</div>
          <button onClick={onClose} className="text-white/25 hover:text-white/60 transition-colors font-mono text-lg leading-none">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function UserRow({
  user,
  onAction,
  onRefresh,
}: {
  user: User;
  onAction: (msg: string, ok: boolean) => void;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [modal, setModal] = useState<string | null>(null);

  // Form states
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceMode, setBalanceMode] = useState<"add" | "set">("add");
  const [extendDays, setExtendDays] = useState("30");
  const [newExpiry, setNewExpiry] = useState("");
  const [newSubDays, setNewSubDays] = useState("30");
  const [newSubRegion, setNewSubRegion] = useState("fi");
  const [newSubDevices, setNewSubDevices] = useState("3");
  const [newSubPlan, setNewSubPlan] = useState("1month");

  const sub = user.subscriptions[0] ?? null;

  const doFetch = async (path: string, opts: RequestInit) => {
    try {
      const res = await api(path, { ...opts, headers: { "Content-Type": "application/json", ...(opts.headers ?? {}) } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ошибка");
      return data;
    } catch (err: any) {
      throw err;
    }
  };

  const handleBalanceChange = async () => {
    const amt = parseFloat(balanceAmount);
    if (isNaN(amt)) return onAction("Введите корректную сумму", false);
    try {
      await doFetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ action: balanceMode === "add" ? "add_balance" : "set_balance", amount: amt }),
      });
      onAction(balanceMode === "add" ? `Баланс пополнен на ${amt} ₽` : `Баланс установлен: ${amt} ₽`, true);
      setModal(null);
      onRefresh();
    } catch (e: any) { onAction(e.message, false); }
  };

  const handleExtend = async () => {
    if (!sub) return;
    const days = parseInt(extendDays);
    if (isNaN(days)) return onAction("Введите количество дней", false);
    try {
      await doFetch(`/api/admin/modify-subscription/${sub.id}`, {
        method: "PATCH",
        body: JSON.stringify({ action: "extend", days }),
      });
      onAction(`Подписка продлена на ${days} дней`, true);
      setModal(null);
      onRefresh();
    } catch (e: any) { onAction(e.message, false); }
  };

  const handleSetExpiry = async () => {
    if (!sub || !newExpiry) return onAction("Выберите дату", false);
    try {
      await doFetch(`/api/admin/modify-subscription/${sub.id}`, {
        method: "PATCH",
        body: JSON.stringify({ action: "set_expires", expires_at: newExpiry }),
      });
      onAction("Дата истечения обновлена", true);
      setModal(null);
      onRefresh();
    } catch (e: any) { onAction(e.message, false); }
  };

  const handleGiveSub = async () => {
    try {
      await doFetch("/api/admin/subscription-actions", {
        method: "POST",
        body: JSON.stringify({
          user_id: user.id,
          plan: newSubPlan,
          days: parseInt(newSubDays),
          region: newSubRegion,
          devices_limit: parseInt(newSubDevices),
        }),
      });
      onAction("Подписка выдана", true);
      setModal(null);
      onRefresh();
    } catch (e: any) { onAction(e.message, false); }
  };

  const handleDeleteSub = async () => {
    if (!sub) return;
    if (!confirm(`Удалить подписку #${sub.id}?`)) return;
    try {
      await doFetch(`/api/admin/modify-subscription/${sub.id}`, { method: "DELETE" });
      onAction("Подписка удалена", true);
      onRefresh();
    } catch (e: any) { onAction(e.message, false); }
  };

  const handleDeleteUser = async () => {
    if (!confirm(`Полностью удалить пользователя ${user.username ?? user.id}? Это необратимо!`)) return;
    try {
      await doFetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      onAction("Пользователь удалён", true);
      onRefresh();
    } catch (e: any) { onAction(e.message, false); }
  };

  const handleToggleSub = async () => {
    if (!sub) return;
    try {
      const d = await doFetch(`/api/admin/modify-subscription/${sub.id}`, {
        method: "PATCH",
        body: JSON.stringify({ action: "toggle_active" }),
      });
      onAction(`Подписка ${d.is_active ? "активирована" : "деактивирована"}`, true);
      onRefresh();
    } catch (e: any) { onAction(e.message, false); }
  };

  const regionLabel: Record<string, string> = { fi: "🇫🇮 Финляндия", nl: "🇳🇱 Нидерланды" };
  const daysLeft = sub?.expires_at ? Math.ceil((new Date(sub.expires_at).getTime() - Date.now()) / 86400000) : null;

  return (
    <>
      {/* User Row */}
      <div
        className="border border-white/5 rounded-sm bg-white/[0.015] hover:bg-white/[0.03] transition-colors cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="p-3 sm:p-4 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-white/70 text-sm font-bold">
                {user.username ? `@${user.username}` : `ID ${user.id}`}
              </span>
              {user.full_name && (
                <span className="font-mono text-white/30 text-xs">{user.full_name}</span>
              )}
              <span className="font-mono text-white/20 text-[10px]">#{user.id}</span>
            </div>
            <div className="flex gap-3 mt-1 flex-wrap">
              <span className="font-mono text-[10px] text-white/30">
                Баланс: <span className="text-green-400/70">{fmtMoney(user.balance)} ₽</span>
              </span>
              {sub ? (
                <span className={`font-mono text-[10px] ${sub.is_active && daysLeft !== null && daysLeft > 0 ? "text-green-400/60" : "text-red-400/60"}`}>
                  {sub.is_active && daysLeft !== null && daysLeft > 0
                    ? `Подписка: ${daysLeft} дн.`
                    : "Подписка: истекла"}
                </span>
              ) : (
                <span className="font-mono text-[10px] text-white/20">Нет подписки</span>
              )}
              <span className="font-mono text-[10px] text-white/20">
                {fmt(user.created_at)}
              </span>
            </div>
          </div>
          <span className="text-white/20 font-mono text-xs mt-1">{expanded ? "▲" : "▼"}</span>
        </div>

        {expanded && (
          <div className="border-t border-white/5 p-3 sm:p-4" onClick={e => e.stopPropagation()}>
            {/* Subscription info */}
            {sub && (
              <div className="bg-black/30 border border-white/5 rounded-sm p-3 mb-4 text-[10px] font-mono text-white/40 grid grid-cols-2 gap-2">
                <div>Регион: <span className="text-white/60">{regionLabel[sub.region] ?? sub.region}</span></div>
                <div>Тариф: <span className="text-white/60">{sub.plan}</span></div>
                <div>Устройств: <span className="text-white/60">{sub.devices_limit}</span></div>
                <div>Активна: <span className={sub.is_active ? "text-green-400/70" : "text-red-400/60"}>{sub.is_active ? "Да" : "Нет"}</span></div>
                <div>Начало: <span className="text-white/60">{fmt(sub.started_at)}</span></div>
                <div>Истекает: <span className="text-white/60">{fmt(sub.expires_at)}</span></div>
              </div>
            )}

            {/* Action buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Btn onClick={() => setModal("balance")} color="green">💰 Баланс</Btn>
              {sub ? (
                <>
                  <Btn onClick={() => setModal("extend")} color="green">📅 Продлить</Btn>
                  <Btn onClick={() => setModal("expiry")} color="green">✏️ Дата</Btn>
                  <Btn onClick={handleToggleSub} color="yellow">{sub.is_active ? "⏸ Деакт." : "▶ Акт."}</Btn>
                  <Btn onClick={handleDeleteSub} color="red">🗑 Удалить подписку</Btn>
                </>
              ) : (
                <Btn onClick={() => setModal("give_sub")} color="green">🎁 Выдать подписку</Btn>
              )}
              <Btn onClick={handleDeleteUser} color="red">💣 Удалить юзера</Btn>
            </div>
          </div>
        )}
      </div>

      {modal === "balance" && (
        <Modal title="Изменить баланс" onClose={() => setModal(null)}>
          <div className="flex gap-2 mb-3">
            {(["add", "set"] as const).map(m => (
              <button
                key={m}
                onClick={() => setBalanceMode(m)}
                className={`flex-1 py-2 font-mono text-xs border rounded-sm transition-colors ${balanceMode === m ? "border-green-400/40 text-green-400 bg-green-400/8" : "border-white/8 text-white/30 hover:border-white/20"}`}
              >
                {m === "add" ? "Пополнить" : "Установить"}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={balanceAmount}
            onChange={e => setBalanceAmount(e.target.value)}
            placeholder="Сумма в рублях"
            className="w-full bg-black/40 border border-white/10 rounded-sm px-3 py-2.5 text-white/80 font-mono text-sm mb-4 focus:outline-none focus:border-green-400/30"
          />
          <Btn onClick={handleBalanceChange} color="green" wide>Применить</Btn>
        </Modal>
      )}

      {modal === "extend" && sub && (
        <Modal title="Продлить подписку" onClose={() => setModal(null)}>
          <p className="text-white/30 font-mono text-xs mb-3">Текущий срок: {fmt(sub.expires_at)}</p>
          <input
            type="number"
            value={extendDays}
            onChange={e => setExtendDays(e.target.value)}
            placeholder="Количество дней"
            className="w-full bg-black/40 border border-white/10 rounded-sm px-3 py-2.5 text-white/80 font-mono text-sm mb-4 focus:outline-none focus:border-green-400/30"
          />
          <Btn onClick={handleExtend} color="green" wide>Продлить</Btn>
        </Modal>
      )}

      {modal === "expiry" && sub && (
        <Modal title="Установить дату истечения" onClose={() => setModal(null)}>
          <input
            type="datetime-local"
            value={newExpiry}
            onChange={e => setNewExpiry(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-sm px-3 py-2.5 text-white/80 font-mono text-sm mb-4 focus:outline-none focus:border-green-400/30"
          />
          <Btn onClick={handleSetExpiry} color="green" wide>Сохранить</Btn>
        </Modal>
      )}

      {modal === "give_sub" && (
        <Modal title="Выдать подписку" onClose={() => setModal(null)}>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-white/30 font-mono text-[10px] uppercase tracking-widest block mb-1">Дней</label>
              <input type="number" value={newSubDays} onChange={e => setNewSubDays(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-sm px-3 py-2 text-white/80 font-mono text-sm focus:outline-none focus:border-green-400/30" />
            </div>
            <div>
              <label className="text-white/30 font-mono text-[10px] uppercase tracking-widest block mb-1">Устройств</label>
              <input type="number" value={newSubDevices} onChange={e => setNewSubDevices(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-sm px-3 py-2 text-white/80 font-mono text-sm focus:outline-none focus:border-green-400/30" />
            </div>
            <div>
              <label className="text-white/30 font-mono text-[10px] uppercase tracking-widest block mb-1">Регион</label>
              <select value={newSubRegion} onChange={e => setNewSubRegion(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-sm px-3 py-2 text-white/80 font-mono text-sm focus:outline-none">
                <option value="fi">🇫🇮 Финляндия</option>
                <option value="nl">🇳🇱 Нидерланды</option>
              </select>
            </div>
            <div>
              <label className="text-white/30 font-mono text-[10px] uppercase tracking-widest block mb-1">Тариф</label>
              <select value={newSubPlan} onChange={e => setNewSubPlan(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-sm px-3 py-2 text-white/80 font-mono text-sm focus:outline-none">
                <option value="1month">1 месяц</option>
                <option value="3months">3 месяца</option>
                <option value="6months">6 месяцев</option>
                <option value="1year">1 год</option>
              </select>
            </div>
          </div>
          <Btn onClick={handleGiveSub} color="green" wide>Выдать подписку</Btn>
        </Modal>
      )}
    </>
  );
}

function Btn({
  onClick, color, wide, children, disabled,
}: {
  onClick: () => void;
  color: "green" | "red" | "yellow";
  wide?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const cls = {
    green: "border-green-400/25 text-green-400/80 hover:border-green-400/50 hover:text-green-400",
    red: "border-red-400/25 text-red-400/60 hover:border-red-400/50 hover:text-red-400",
    yellow: "border-yellow-400/25 text-yellow-400/60 hover:border-yellow-400/50 hover:text-yellow-400",
  }[color];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${wide ? "w-full" : ""} py-2 px-3 border rounded-sm font-mono text-[11px] tracking-wider transition-all disabled:opacity-40 ${cls}`}
    >
      {children}
    </button>
  );
}


function FinanceTab({ onAction }: { onAction: (msg: string, ok: boolean) => void }) {
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expDesc, setExpDesc] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [expenses, setExpenses] = useState<{ desc: string; amount: number; date: string }[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("/api/admin/finance");
      const d = await res.json();
      setData(d);
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const addExpense = async () => {
    const amt = parseFloat(expAmount);
    if (!expDesc.trim() || isNaN(amt) || amt <= 0) return onAction("Заполните описание и сумму", false);
    try {
      const res = await api("/api/admin/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: expDesc, amount: amt }),
      });
      if (!res.ok) throw new Error();
      setExpenses(prev => [...prev, { desc: expDesc, amount: amt, date: new Date().toISOString() }]);
      setExpDesc("");
      setExpAmount("");
      onAction("Расход записан", true);
    } catch { onAction("Ошибка при записи расхода", false); }
  };

  if (loading) return <div className="text-white/20 font-mono text-sm py-8 text-center">Загрузка...</div>;
  if (!data) return null;

  const profit = data.total_paid - totalExpenses;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Доходы (всего)", value: `${fmtMoney(data.total_paid)} ₽`, color: "text-green-400" },
          { label: "Расходы (сессия)", value: `${fmtMoney(totalExpenses)} ₽`, color: "text-red-400/70" },
          { label: "Прибыль", value: `${fmtMoney(profit)} ₽`, color: profit >= 0 ? "text-green-400" : "text-red-400" },
          { label: "Активных подписок", value: String(data.active_subs), color: "text-white/60" },
        ].map(card => (
          <div key={card.label} className="border border-white/6 bg-white/[0.015] rounded-sm p-4">
            <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">{card.label}</div>
            <div className={`font-mono text-lg font-bold ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {data.monthly.length > 0 && (
        <div className="border border-white/6 bg-white/[0.015] rounded-sm p-4">
          <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">— По месяцам</div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {data.monthly.map(m => (
              <div key={m.month} className="flex items-center justify-between font-mono text-xs">
                <span className="text-white/40">
                  {new Date(m.month).toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}
                </span>
                <div className="flex gap-4">
                  <span className="text-white/25">{m.count} платежей</span>
                  <span className="text-green-400/70">{fmtMoney(m.amount)} ₽</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border border-white/6 bg-white/[0.015] rounded-sm p-4">
        <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">— Добавить расход</div>
        <div className="flex gap-2 flex-col sm:flex-row">
          <input
            type="text"
            placeholder="Описание"
            value={expDesc}
            onChange={e => setExpDesc(e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded-sm px-3 py-2 text-white/80 font-mono text-sm focus:outline-none focus:border-green-400/30"
          />
          <input
            type="number"
            placeholder="Сумма ₽"
            value={expAmount}
            onChange={e => setExpAmount(e.target.value)}
            className="w-full sm:w-36 bg-black/40 border border-white/10 rounded-sm px-3 py-2 text-white/80 font-mono text-sm focus:outline-none focus:border-green-400/30"
          />
          <button
            onClick={addExpense}
            className="py-2 px-4 border border-red-400/25 text-red-400/70 font-mono text-xs rounded-sm hover:border-red-400/50 hover:text-red-400 transition-all"
          >
            + Расход
          </button>
        </div>

        {expenses.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {expenses.map((e, i) => (
              <div key={i} className="flex items-center justify-between font-mono text-xs text-white/40">
                <span>{e.desc}</span>
                <span className="text-red-400/60">−{fmtMoney(e.amount)} ₽</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentsTab({ onAction }: { onAction: (msg: string, ok: boolean) => void }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState<"pending" | "paid" | "all">("pending");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api(`/api/admin/payments?status=${filter}`);
      const d = await res.json();
      setPayments(d.payments ?? []);
    } catch { } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const deleteSingle = async (id: number) => {
    try {
      const res = await api("/api/admin/payments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: id }),
      });
      if (!res.ok) throw new Error();
      setPayments(prev => prev.filter(p => p.id !== id));
      onAction("Платёж удалён", true);
    } catch { onAction("Ошибка удаления", false); }
  };

  const deleteAllPending = async () => {
    if (!confirm("Удалить ВСЕ pending платежи?")) return;
    try {
      const res = await api("/api/admin/payments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delete_all_pending: true }),
      });
      const d = await res.json();
      onAction(`Удалено ${d.deleted} pending платежей`, true);
      load();
    } catch { onAction("Ошибка", false); }
  };

  const pending = payments.filter(p => p.status === "pending");

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["pending", "paid", "all"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 font-mono text-xs border rounded-sm transition-colors ${filter === f ? "border-green-400/40 text-green-400 bg-green-400/8" : "border-white/8 text-white/30 hover:border-white/20"}`}
          >
            {f === "pending" ? "🕐 Pending" : f === "paid" ? "✓ Оплаченные" : "Все"}
          </button>
        ))}
        {filter === "pending" && pending.length > 0 && (
          <button
            onClick={deleteAllPending}
            className="ml-auto px-3 py-1.5 font-mono text-xs border border-red-400/30 text-red-400/70 rounded-sm hover:border-red-400/50 hover:text-red-400 transition-colors"
          >
            🗑 Удалить все pending ({pending.length})
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-white/20 font-mono text-sm py-8 text-center">Загрузка...</div>
      ) : payments.length === 0 ? (
        <div className="text-white/20 font-mono text-sm py-8 text-center">Нет платежей</div>
      ) : (
        <div className="space-y-2">
          {payments.map(p => (
            <div key={p.id} className="border border-white/5 rounded-sm bg-white/[0.01] p-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-mono text-xs font-bold ${p.status === "paid" ? "text-green-400" : p.status === "pending" ? "text-yellow-400/70" : "text-red-400/60"}`}>
                    {p.status === "paid" ? "✓" : p.status === "pending" ? "⏳" : "✕"} {p.amount} {p.currency}
                  </span>
                  <span className="font-mono text-[10px] text-white/25">{p.provider ?? "—"}</span>
                </div>
                <div className="font-mono text-[10px] text-white/30 mt-0.5">
                  {p.username ? `@${p.username}` : `#${p.user_id}`} · {fmt(p.created_at)}
                  {p.paid_at && ` · оплачен ${fmt(p.paid_at)}`}
                </div>
              </div>
              {p.status === "pending" && (
                <button
                  onClick={() => deleteSingle(p.id)}
                  className="shrink-0 text-red-400/40 hover:text-red-400 font-mono text-xs transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UsersTab({ onAction }: { onAction: (msg: string, ok: boolean) => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api("/api/admin/users");
      const d = await res.json();
      setUsers(d.users ?? []);
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return !q
      || String(u.id).includes(q)
      || (u.username ?? "").toLowerCase().includes(q)
      || (u.full_name ?? "").toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Поиск по ID, @username, имени..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-black/40 border border-white/10 rounded-sm px-3 py-2 text-white/80 font-mono text-sm focus:outline-none focus:border-green-400/30"
        />
        <button
          onClick={load}
          className="px-3 py-2 border border-white/8 text-white/30 font-mono text-xs rounded-sm hover:border-white/20 hover:text-white/50 transition-colors"
        >
          ↻
        </button>
      </div>

      <div className="text-white/20 font-mono text-[10px] mb-3 uppercase tracking-widest">
        Всего: {filtered.length} из {users.length}
      </div>

      {loading ? (
        <div className="text-white/20 font-mono text-sm py-8 text-center">Загрузка...</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(u => (
            <UserRow key={u.id} user={u} onAction={onAction} onRefresh={load} />
          ))}
        </div>
      )}
    </div>
  );
}
export default function AdminClient() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("users");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // Check session on mount
  useEffect(() => {
    api("/api/admin/users?limit=1")
      .then(r => setAuthed(r.ok))
      .catch(e => setAuthed(e.message === "UNAUTH" ? false : false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthed(false);
  };

  if (authed === null) {
    return (
      <div className="min-h-screen bg-[#060606] flex items-center justify-center">
        <div className="text-green-400/40 font-mono text-sm animate-pulse">Проверка сессии...</div>
      </div>
    );
  }

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "users", label: "👥 Пользователи" },
    { id: "payments", label: "💳 Платежи" },
    { id: "finance", label: "📊 Финансы" },
  ];

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <div className="fixed inset-0 opacity-[0.018] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(#00ff88 1px,transparent 1px),linear-gradient(90deg,#00ff88 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

      <header className="sticky top-0 z-40 border-b border-white/6 bg-[#060606]/95 backdrop-blur-sm px-4 sm:px-6 py-3 flex items-center justify-between">
        <div>
          <div className="text-[9px] font-mono tracking-[0.4em] text-green-400/40 uppercase">◈ escape the matrix</div>
          <div className="font-mono text-white/50 text-xs tracking-widest uppercase">Панель управления</div>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 border border-white/8 text-white/25 font-mono text-[10px] hover:border-red-400/30 hover:text-red-400/60 transition-all rounded-sm uppercase tracking-wider"
        >
          Выйти
        </button>
      </header>
      <div className="border-b border-white/5 px-4 sm:px-6 flex gap-1 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`py-3 px-4 font-mono text-xs whitespace-nowrap border-b-2 transition-colors ${tab === t.id ? "border-green-400 text-green-400" : "border-transparent text-white/30 hover:text-white/50"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {tab === "users" && <UsersTab onAction={showToast} />}
        {tab === "payments" && <PaymentsTab onAction={showToast} />}
        {tab === "finance" && <FinanceTab onAction={showToast} />}
      </main>

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </div>
  );
}