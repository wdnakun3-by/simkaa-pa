import React, { useState, useRef } from 'react';
import { PembinaanRecord, Santri } from '../../types';
import { useApp } from '../../context/AppContext';
import { MosqueLogoIcon } from '../layout/IslamicPattern';
import { Printer, X, Download, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

interface FormPembinaanA4Props {
  pembinaan: PembinaanRecord;
  santri?: Santri;
  onClose: () => void;
}

export const FormPembinaanA4: React.FC<FormPembinaanA4Props> = ({
  pembinaan,
  santri,
  onClose
}) => {
  const { allRiwayatList, showToast } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Filter pelanggaran santri
  const santriViolations = allRiwayatList.filter(
    (r) => r.santriId === pembinaan.santriId
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsGenerating(true);

    try {
      const pageElement = printRef.current;
      const canvas = await html2canvas(pageElement, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // A4 page dimensions in mm
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      const cleanName = (pembinaan.santriNama || santri?.nama || 'Santri').replace(/[\\/:*?"<>|]/g, '').trim();
      pdf.save(`Form_Pembinaan_${cleanName}_${pembinaan.santriUnit}.pdf`);

      showToast('PDF Berhasil Diunduh', `File Form Pembinaan untuk ${cleanName} berhasil disimpan.`, 'success');
    } catch (err: any) {
      console.error('[PDF ERROR]', err);
      showToast('Gagal Download PDF', err?.message || 'Terjadi kesalahan saat membuat file PDF.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      id="form-pembinaan-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white animate-in fade-in duration-200"
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] my-auto print:m-0 print:border-none print:shadow-none print:max-w-none print:bg-white print:overflow-visible">
        
        {/* Top Control Bar - Hidden when printing */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-800 border-b border-slate-700 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Pratinjau Lembar Berita Acara & Form Pembinaan Santri (A4)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-download-pdf-pembinaan"
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md cursor-pointer transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Membuat PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
            <button
              id="btn-print-pembinaan"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold shadow-md cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Form</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Wrapper */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          
          {/* Printable A4 Canvas Container */}
          <div
            id="pembinaan-a4-page"
            ref={printRef}
            className="w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 sm:p-10 shadow-xl flex flex-col justify-between print:w-full print:min-h-0 print:p-8 print:shadow-none"
            style={{ boxSizing: 'border-box' }}
          >
            <div>
              {/* ============================================================ */}
              {/* 1. KOP SURAT PESANTREN */}
              {/* ============================================================ */}
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="w-16 h-16 rounded-full border-2 border-slate-800 flex items-center justify-center shrink-0">
                  <MosqueLogoIcon className="w-10 h-10 text-slate-800" />
                </div>
                <div className="text-center">
                  <h1 className="text-lg font-black uppercase tracking-wider text-slate-900 leading-tight">
                    PONDOK PESANTREN ISLAM TERPADU
                  </h1>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-800 leading-tight mt-0.5">
                    BAGIAN KEPESANTRENAN & PEMBINAAN AKHLAK SANTRI (SIMKA.ID)
                  </h2>
                  <p className="text-[10px] text-slate-600 mt-1 leading-snug">
                    Jl. Pesantren Luhur No. 01, Kompleks Islamic Centre • Telp: (021) 8899-7766 • Email: kepesantrenan@pesantren.id
                  </p>
                </div>
              </div>

              {/* ============================================================ */}
              {/* 2. GARIS PEMISAH */}
              {/* ============================================================ */}
              <div className="w-full border-b-2 border-slate-900 mb-0.5" />
              <div className="w-full border-b border-slate-700 mb-4" />

              {/* ============================================================ */}
              {/* 3. JUDUL SURAT & 4. NOMOR SURAT */}
              {/* ============================================================ */}
              <div className="text-center mb-4">
                <h3 className="text-sm font-black uppercase tracking-wide underline underline-offset-4 text-slate-900">
                  BERITA ACARA & FORM TINDAKAN PEMBINAAN SANTRI
                </h3>
                <p className="text-[11px] font-semibold text-slate-600 mt-1 font-mono">
                  Nomor: {pembinaan.id.slice(0, 8).toUpperCase()}/SIMKA-PBN/{new Date().getFullYear()}
                </p>
              </div>

              {/* ============================================================ */}
              {/* 5. IDENTITAS SANTRI (TABEL RAPI) */}
              {/* ============================================================ */}
              <div className="mb-4">
                <div className="bg-slate-100 px-3 py-1 border border-slate-300 font-bold text-[11px] text-slate-900 uppercase tracking-wider mb-1 rounded-t">
                  I. IDENTITAS SANTRI TERBINA
                </div>
                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="w-36 px-3 py-1.5 bg-slate-50 font-semibold text-slate-700 border-r border-slate-300">
                        Nama Lengkap
                      </td>
                      <td className="px-3 py-1.5 font-bold text-slate-900 border-r border-slate-300">
                        {pembinaan.santriNama}
                      </td>
                      <td className="w-32 px-3 py-1.5 bg-slate-50 font-semibold text-slate-700 border-r border-slate-300">
                        Unit Pendidikan
                      </td>
                      <td className="px-3 py-1.5 font-bold text-slate-900">
                        Unit {pembinaan.santriUnit}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="px-3 py-1.5 bg-slate-50 font-semibold text-slate-700 border-r border-slate-300">
                        Nomor Induk (NIS)
                      </td>
                      <td className="px-3 py-1.5 font-mono text-slate-800 border-r border-slate-300">
                        {santri?.nis || '-'}
                      </td>
                      <td className="px-3 py-1.5 bg-slate-50 font-semibold text-slate-700 border-r border-slate-300">
                        Kelas / Kamar
                      </td>
                      <td className="px-3 py-1.5 text-slate-800">
                        Kelas {pembinaan.santriKelas} ({santri?.asrama || `Asrama ${pembinaan.santriUnit}`})
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 bg-slate-50 font-semibold text-slate-700 border-r border-slate-300">
                        Musyrif Pembina
                      </td>
                      <td className="px-3 py-1.5 text-slate-800 border-r border-slate-300">
                        {santri?.musyrif || pembinaan.pembina || '-'}
                      </td>
                      <td className="px-3 py-1.5 bg-slate-50 font-semibold text-slate-700 border-r border-slate-300">
                        Akumulasi Poin
                      </td>
                      <td className="px-3 py-1.5 font-bold text-rose-700">
                        {santri?.totalPoin || 0} Poin ({santri?.statusPembinaan || 'Perlu Pembinaan'})
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* ============================================================ */}
              {/* 6. DETAIL PELANGGARAN (TABEL) */}
              {/* ============================================================ */}
              <div className="mb-4">
                <div className="bg-slate-100 px-3 py-1 border border-slate-300 font-bold text-[11px] text-slate-900 uppercase tracking-wider mb-1 rounded-t">
                  II. DETAIL CATATAN PELANGGARAN KEDISIPLINAN
                </div>
                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <thead className="bg-slate-100 text-slate-800 font-bold text-[11px] border-b border-slate-300">
                    <tr>
                      <th className="py-1.5 px-2.5 text-center border-r border-slate-300 w-10">No</th>
                      <th className="py-1.5 px-3 text-left border-r border-slate-300 w-28">Tanggal</th>
                      <th className="py-1.5 px-3 text-left border-r border-slate-300">Jenis Pelanggaran</th>
                      <th className="py-1.5 px-2.5 text-center border-r border-slate-300 w-16">Poin</th>
                      <th className="py-1.5 px-3 text-left border-r border-slate-300">Sanksi / Konsekuensi</th>
                      <th className="py-1.5 px-3 text-left w-24">Dicatat Oleh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {santriViolations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-2.5 px-3 text-center text-slate-500 italic">
                          Pelanggaran tercatat pada sesi tindakan ini ({santri?.totalPoin || 0} Poin akumulasi)
                        </td>
                      </tr>
                    ) : (
                      santriViolations.slice(0, 4).map((v, idx) => (
                        <tr key={v.id} className="text-[11px]">
                          <td className="py-1.5 px-2.5 text-center border-r border-slate-300 font-medium">{idx + 1}</td>
                          <td className="py-1.5 px-3 border-r border-slate-300 text-slate-600">{v.tanggal}</td>
                          <td className="py-1.5 px-3 border-r border-slate-300 font-medium text-slate-900">{v.jenisPelanggaranNama}</td>
                          <td className="py-1.5 px-2.5 text-center border-r border-slate-300 font-bold text-rose-600">{v.poin}</td>
                          <td className="py-1.5 px-3 border-r border-slate-300 text-slate-700">{v.hukuman || '-'}</td>
                          <td className="py-1.5 px-3 text-slate-600">{v.pencatat || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* ============================================================ */}
              {/* 7. TINDAKAN PEMBINAAN */}
              {/* ============================================================ */}
              <div className="mb-4">
                <div className="bg-slate-100 px-3 py-1 border border-slate-300 font-bold text-[11px] text-slate-900 uppercase tracking-wider mb-1 rounded-t">
                  III. TINDAKAN & BENTUK PEMBINAAN RESMI
                </div>
                <table className="w-full border-collapse border border-slate-300 text-xs">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="w-36 px-3 py-1.5 bg-slate-50 font-semibold text-slate-700 border-r border-slate-300">
                        Bentuk Pembinaan
                      </td>
                      <td className="px-3 py-1.5 font-bold text-slate-900 border-r border-slate-300">
                        {pembinaan.jenisPembinaan}
                      </td>
                      <td className="w-32 px-3 py-1.5 bg-slate-50 font-semibold text-slate-700 border-r border-slate-300">
                        Ustadz Pembina
                      </td>
                      <td className="px-3 py-1.5 font-bold text-slate-900">
                        {pembinaan.pembina}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="px-3 py-1.5 bg-slate-50 font-semibold text-slate-700 border-r border-slate-300">
                        Tanggal Ditetapkan
                      </td>
                      <td className="px-3 py-1.5 text-slate-800 border-r border-slate-300">
                        {pembinaan.tanggal}
                      </td>
                      <td className="px-3 py-1.5 bg-slate-50 font-semibold text-slate-700 border-r border-slate-300">
                        Target Selesai
                      </td>
                      <td className="px-3 py-1.5 text-slate-800">
                        {pembinaan.tanggalTargetSelesai || 'Sesuai Arahan Musyrif'}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 bg-slate-50 font-semibold text-slate-700 border-r border-slate-300 align-top">
                        Instruksi & Catatan
                      </td>
                      <td colSpan={3} className="px-3 py-1.5 text-slate-800 leading-relaxed">
                        {pembinaan.catatan || 'Santri berkomitmen untuk memperbaiki diri, disiplin shalat berjamaah 5 waktu di masjid, dan menjaga adab islami.'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Komitmen Santri Box */}
              <div className="border border-slate-300 bg-slate-50/50 p-2.5 rounded mb-4 text-[10.5px] leading-relaxed text-slate-700 italic">
                <span className="font-bold not-italic text-slate-900">Komitmen Santri: </span>
                "Saya mengakui kekhilafan saya dan berjanji dengan sungguh-sungguh untuk mentaati tata tertib Pondok Pesantren, menjaga amanah, berakhlak mulia, dan melaksanakan seluruh rangkaian pembinaan ini dengan penuh keikhlasan demi ridha Allah SWT."
              </div>
            </div>

            {/* ============================================================ */}
            {/* 8. TANDA TANGAN 3 PIHAK: */}
            {/* - Musyrif / Pembina */}
            {/* - Koordinator Unit */}
            {/* - Kasie Kepesantrenan */}
            {/* ============================================================ */}
            <div className="pt-2">
              <p className="text-right text-xs text-slate-700 mb-4 font-medium">
                Ditetapkan di Tengaran, {pembinaan.tanggal}
              </p>

              <div className="grid grid-cols-3 gap-6 text-center text-xs">
                {/* Pihak 1: Musyrif / Pembina */}
                <div className="flex flex-col justify-between h-28">
                  <p className="font-bold text-slate-800">
                    Musyrif / Pembina,
                  </p>
                  <div>
                    <p className="font-bold text-slate-900 underline underline-offset-2">
                      {pembinaan.pembina || santri?.musyrif || 'Ustadz Musyrif'}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      Pembina Asrama
                    </p>
                  </div>
                </div>

                {/* Pihak 2: Koordinator Unit */}
                <div className="flex flex-col justify-between h-28">
                  <p className="font-bold text-slate-800">
                    Koordinator Unit {pembinaan.santriUnit},
                  </p>
                  <div>
                    <p className="font-bold text-slate-900 underline underline-offset-2">
                      Ust. Koordinator {pembinaan.santriUnit}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      Koordinator Kedisiplinan
                    </p>
                  </div>
                </div>

                {/* Pihak 3: Kasie Kepesantrenan */}
                <div className="flex flex-col justify-between h-28">
                  <p className="font-bold text-slate-800">
                    Mengetahui,<br />Kasie Kepesantrenan
                  </p>
                  <div>
                    <p className="font-bold text-slate-900 underline underline-offset-2">
                      Ust. H. Abdullah Mansur, Lc.
                    </p>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      Kepala Bidang Kepesantrenan
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
