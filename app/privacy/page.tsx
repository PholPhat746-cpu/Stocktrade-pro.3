export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-200 px-5 py-8 max-w-2xl mx-auto space-y-6">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">นโยบายความเป็นส่วนตัว (Privacy Policy)</h1>
        <p className="text-xs text-slate-400 mt-1">แอปพลิเคชัน: StockTrade Pro | อัปเดตล่าสุด: พฤศจิกายน 2026</p>
      </header>

      <section className="space-y-2 text-sm leading-relaxed text-slate-300">
        <h2 className="text-base font-semibold text-emerald-400">1. ข้อมูลที่เราเก็บรวบรวม</h2>
        <p>
          แอปพลิเคชัน <strong>StockTrade Pro</strong> จัดทำขึ้นเพื่อจำลองการเรียนรู้และฝึกฝนการซื้อขายหลักทรัพย์ (Demo Trading)
          โดยใช้ข้อมูลอีเมลสำหรับการเข้าสู่ระบบและบันทึกสถิติพอร์ตการลงทุนจำลองของผู้ใช้งานเท่านั้น
        </p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed text-slate-300">
        <h2 className="text-base font-semibold text-emerald-400">2. การใช้ข้อมูลและการเชื่อมต่อภายนอก</h2>
        <p>
          แอปพลิเคชันแสดงผลกราฟราคาผ่านวิดเจ็ตมาตรฐานของ TradingView โดยไม่มีการเก็บข้อมูลบัตรเครดิต
          ข้อมูลธุรกรรมทางการเงินจริง หรือรหัสโฆษณา (Advertising ID) เพื่อการติดตามเชิงพาณิชย์
        </p>
      </section>

      <section className="space-y-2 text-sm leading-relaxed text-slate-300">
        <h2 className="text-base font-semibold text-emerald-400">3. ความปลอดภัยและการลบข้อมูล</h2>
        <p>
          ผู้ใช้งานสามารถขอลบบัญชีและประวัติการบันทึกทั้งหมดได้ตลอดเวลาโดยติดต่อผู้พัฒนาโดยตรง
        </p>
      </section>

      <section className="bg-[#111827] p-4 rounded-xl border border-slate-800 text-sm space-y-1">
        <h2 className="font-semibold text-white">4. ช่องทางติดต่อผู้พัฒนา (Developer Contact)</h2>
        <p className="text-slate-400">ผู้พัฒนา: คุณพล (StockTrade Pro Developer)</p>
        <p className="text-slate-400">อีเมล: <span className="text-emerald-400">bebbel6991@gmail.com</span></p>
      </section>
    </main>
  );
}
