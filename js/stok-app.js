var app = new Vue({
    el: '#app',
    data: {
        upbjjList: baseData.upbjjList,
        kategoriList: baseData.kategoriList,
        stok: baseData.stok,
        
        // State Filter & Sorting
        selectedUpbjj: '',
        selectedKategori: '',
        filterReorder: 'all',
        sortBy: 'judul',

        // State Form Input Tambah Buku Baru
        form: {
            kode: '',
            judul: '',
            kategori: '',
            upbjj: '',
            lokasiRak: '',
            harga: 0,
            qty: 0,
            safety: 0,
            catatanHTML: ''
        },
        formError: '',
        alertMessage: ''
    },
    computed: {
        filteredStok: function() {
            var self = this;
            var result = self.stok;

            // Filter UT-Daerah
            if (self.selectedUpbjj) {
                result = result.filter(function(item) {
                    return item.upbjj === self.selectedUpbjj;
                });
            }

            // Filter Kategori (Dependent)
            if (self.selectedKategori) {
                result = result.filter(function(item) {
                    return item.kategori === self.selectedKategori;
                });
            }

            // Filter Reorder
            if (self.filterReorder === 'low') {
                result = result.filter(function(item) {
                    return item.qty < item.safety;
                });
            }

            // Sorting
            return result.slice().sort(function(a, b) {
                if (self.sortBy === 'judul') {
                    return a.judul.localeCompare(b.judul);
                } else if (self.sortBy === 'qty') {
                    return a.qty - b.qty;
                } else if (self.sortBy === 'harga') {
                    return a.harga - b.harga;
                }
                return 0;
            });
        }
    },
    watch: {
        selectedUpbjj: function(newVal) {
            if (newVal) {
                this.alertMessage = "Filter UT Daerah diubah ke: " + newVal + ". Kategori mata kuliah kini diaktifkan.";
            } else {
                this.selectedKategori = '';
                this.alertMessage = "Filter UT Daerah direset.";
            }
        }
    },
    methods: {
        resetFilter: function() {
            this.selectedUpbjj = '';
            this.selectedKategori = '';
            this.filterReorder = 'all';
            this.sortBy = 'judul';
            this.alertMessage = "Semua filter berhasil di-reset.";
        },
        
        // Fungsi Tambah Buku Baru
        tambahStok: function() {
            if (!this.form.kode || !this.form.judul || !this.form.kategori || !this.form.upbjj) {
                this.formError = "Mohon lengkapi seluruh field wajib (Kode, Judul, Kategori, UPBJJ)!";
                return;
            }
            this.formError = '';
            
            this.stok.push({
                kode: this.form.kode,
                judul: this.form.judul,
                kategori: this.form.kategori,
                upbjj: this.form.upbjj,
                lokasiRak: this.form.lokasiRak || 'R0-00',
                harga: Number(this.form.harga) || 0,
                qty: Number(this.form.qty) || 0,
                safety: Number(this.form.safety) || 5,
                catatanHTML: this.form.catatanHTML || 'Baru ditambahkan'
            });

            this.alertMessage = "Sukses menambahkan bahan ajar baru: " + this.form.judul;
            this.form = { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: 0, qty: 0, safety: 0, catatanHTML: '' };
        },

        // FUNGSI EDIT TERBARU: Mengubah Stok Qty & Catatan
       editStok: function(item) {
            // Prompt 1: Mengubah jumlah Qty stok
            var newQty = prompt("Edit Jumlah Stok (Qty) untuk '" + item.judul + "':", item.qty);
            
            if (newQty !== null && newQty.trim() !== "" && !isNaN(newQty)) {
                item.qty = Number(newQty);
                
                // Prompt 2: Mengubah catatan buku yang akan tampil di tabel catatan
                var currentCatatanClean = item.catatanHTML.replace(/<[^>]*>?/gm, '');
                var newCatatan = prompt("Edit Catatan Buku untuk '" + item.judul + "':", currentCatatanClean);
                
                if (newCatatan !== null && newCatatan.trim() !== "") {
                    item.catatanHTML = newCatatan;
                }

                this.alertMessage = "Data stok dan catatan untuk '" + item.judul + "' berhasil diperbarui.";
            }
        }
    }
});