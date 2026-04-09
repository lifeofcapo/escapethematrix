export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-mono font-black text-green-400 uppercase mb-8">
          Политика конфиденциальности
        </h1>
        <div className="prose prose-invert prose-sm md:prose-base font-mono text-white/60 max-w-none">
          <p className="text-white/40">Последнее обновление: 09.04.2026</p>

          <h2 className="text-white font-mono text-xl mt-8 mb-4">1. Общие положения</h2>
          <p>
            Escape The Matrix (далее — «Сервис», «мы») не собирает и не хранит персональные данные пользователей.
            Мы не ведём логи подключений, не фиксируем IP-адреса, не отслеживаем историю посещений и не анализируем
            трафик пользователей. Наша инфраструктура построена таким образом, чтобы технически исключить возможность
            сбора подобной информации.
          </p>

          <h2 className="text-white font-mono text-xl mt-8 mb-4">2. Какие данные мы НЕ собираем</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>IP-адреса (оригинальные и назначенные)</li>
            <li>Временные метки подключения</li>
            <li>Объём переданного/полученного трафика</li>
            <li>DNS-запросы</li>
            <li>Информация об устройствах и браузерах</li>
          </ul>

          <h2 className="text-white font-mono text-xl mt-8 mb-4">3. Данные, необходимые для работы</h2>
          <p>
            Единственная информация, которую мы можем иметь — это данные, добровольно предоставленные пользователем
            через Telegram-бота (<strong>@EscapeTheMatrix_Bot</strong>) для управления подпиской:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Telegram ID (для идентификации подписки)</li>
            <li>Username в Telegram (опционально, для удобства)</li>
            <li>Информация о сроке действия подписки и количестве устройств</li>
          </ul>
          <p>Эти данные хранятся в зашифрованном виде и используются исключительно для предоставления доступа к сервису.</p>

          <h2 className="text-white font-mono text-xl mt-8 mb-4">4. Платёжная информация</h2>
          <p>
            Мы не обрабатываем и не храним платёжные данные (номера карт, крипто-кошельки и т.д.).
            Все платежи проходят через сторонние защищённые шлюзы (например, Telegram Payments, крипто-процессинги).
            Сервис получает только подтверждение факта оплаты и сумму.
          </p>

          <h2 className="text-white font-mono text-xl mt-8 mb-4">5. Использование файлов cookie</h2>
          <p>
            Сайт <span className="text-green-400">escapethematrix.to</span> не использует собственные cookie для
            отслеживания. Возможно использование технических cookie для обеспечения работы сессий (например,
            для запоминания выбранного языка), которые не содержат идентифицирующей информации.
          </p>

          <h2 className="text-white font-mono text-xl mt-8 mb-4">6. Передача данных третьим лицам</h2>
          <p>
            Мы не передаём никакие данные третьим лицам, поскольку не располагаем таковыми.
            Мы не сотрудничаем с рекламными сетями и аналитическими платформами.
          </p>

          <h2 className="text-white font-mono text-xl mt-8 mb-4">7. Безопасность</h2>
          <p>
            Мы применяем современные методы шифрования для защиты каналов связи (VLESS + Reality) и
            инфраструктуры. Доступ к серверам строго ограничен.
          </p>

          <h2 className="text-white font-mono text-xl mt-8 mb-4">8. Изменения в политике</h2>
          <p>
            Мы оставляем за собой право вносить изменения в настоящую Политику конфиденциальности.
            Новая редакция вступает в силу с момента её публикации на Сайте.
          </p>

          <h2 className="text-white font-mono text-xl mt-8 mb-4">9. Контакты</h2>
          <p>
            По всем вопросам, связанным с конфиденциальностью, обращайтесь в нашего Telegram-бота:
            <a href="https://t.me/EscapeTheMatrix_Bot" className="text-green-400 hover:underline ml-1">
              @EscapeTheMatrix_Bot
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}