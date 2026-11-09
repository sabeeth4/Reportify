const navLinks = document.querySelectorAll('.navbar a');
const pages = document.querySelectorAll('.page');

function showPage(pageId) {
    pages.forEach(page => {
        if (page.id === pageId) {
            // input-page aslinya grid, dashboard biasa
            page.style.display = (pageId === 'input-page') ? 'grid' : 'block';
        } else {
            page.style.display = 'none';
        }
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
    });

    window.scrollTo(0, 0);
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(link.dataset.page);
    });
});

// halaman awal
showPage('input-page');

// menentukan nama tempat data disimpan di localstorage
const KUNCI_STORAGE = 'E_REPORT_DATA'

// variabel global untuk menyimpan data laporan
let daftarLaporan = [];

// fungsi muat data di eksekusi ketika halaman html selesai dimuat
document.addEventListener('DOMContentLoaded',muatData());

// READ -> Mengambil data ke data.js
function muatData() {
    daftarLaporan = typeof dataAwalLaporan !== 'undefined' ?[...dataAwalLaporan] : [];
    // console.log(daftarLaporan);
    tampilkanDataTabel();
}


// menampilkan data ke halaman web
function tampilkanDataTabel() {
    const tableBody = document.getElementById('reports-table-body');

    // memastikan tablebody kosong
    tableBody.innerHTML = '';

    // menampilkan baris data
    daftarLaporan.forEach((laporan) => {
        tableBody.appendChild(buatBarisLaporan(laporan));
    }); 
}


// membuat satu baris tr untuk satu laporan
function buatBarisLaporan(laporan) {
    // membuat tr baru
    const baris = document.createElement('tr');

    const sudahFixed = (laporan.status || '').toLowerCase() === 'fixed';

    baris.innerHTML = `
    <td class="cell-table">
        <span>${laporan.pelapor}</span>
    </td>
    <td class="cell-table">
        <span>${laporan.kategori}</span>
    </td>
    <td class="cell-table">
        <p>${laporan.deskripsi}</p>
    </td>
    <td class="cell-table">
        <span class="badge ${sudahFixed ? 'badge-fixed' : 'badge-waiting'}">${sudahFixed ? 'Fixed' : 'Waiting'}
        </span>
    </td>
    <td class="cell-table">
        <div class="actions">
            <button class="btn-action btn-delete" data-aksi="hapus" data-id="${laporan.id}" title="Hapus">
                <i class="ri-delete-bin-line"></i>
            </button>
            <button class="btn-action btn-done" data-aksi="selesai" data-id="${laporan.id}" title="Tandai selesai">
                <i class="ri-check-line"></i>
            </button>
        </div>
    </td>        
    `
    return baris;
}



// 3. CREATE => menambahkan data laporan baru

function handleFormSubmit(event)  {

    event.preventDefault(); //mencegah halaman ter-refresh
    // mengambil isi form
    const form = event.target
    const nama = form.reporter.value.trim();
    const kategori = form.category.value;
    const deskripsi = form.description.value.trim();

    // pegecekan value (validasi) => mengecek apakah semua input terisi
    if(!nama || !kategori || !deskripsi) {
        return console.log("Mohon lengkapi semua data!");
    }

    // membuat objek laporan baru
    const laporanBaru = {
        id: `rep-${Date.now()}`,  //id unik berdasarkan waktu saat ini
        pelapor: nama,
        kategori: kategori,
        deskripsi: deskripsi,
        status: 'Waiting'
    };

    // menambahkan laporan baru ke data lama
    daftarLaporan.unshift(laporanBaru)
    // menyimpan ke dalam local storage
    simpanData();
    tampilkanDataTabel();

    // mengosongkan form
    form.reset();

    // Sweet alert
    Swal.fire({
  title: "Report Sent!",
  text: "Laporanmu udah masuk.",
  confirmButtonText: "Siap!",
  width: 300,
  buttonsStyling: false,
  customClass: {
    popup: "reportify-popup",
    confirmButton: "reportify-btn",
        },
    });
}

// Proses menyimpan data ke local storage
function simpanData() {
    localStorage.setItem(KUNCI_STORAGE, JSON.stringify(daftarLaporan))
}