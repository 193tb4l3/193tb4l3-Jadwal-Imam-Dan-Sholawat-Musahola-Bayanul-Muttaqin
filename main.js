document.addEventListener("DOMContentLoaded", function () {

    // =============================
    // 1. DOM ELEMENTS
    // =============================
    const container = document.getElementById("jadwal-container");
    const searchInput = document.getElementById("searchInput");
    const exportExcelBtn = document.getElementById("exportExcelBtn");
    const exportPdfBtn = document.getElementById("exportPdfBtn");
    const exportTableBody = document.querySelector("#exportTable tbody");

    // =============================
    // 2. DATA TERBARU
    // =============================

    const imamList = [
        "Satudi S.Pdi",
        "Senan S.Pdi",
        "Sudiarti",
        "Wahadi",
        "Muhammad Nurul Azman"
    ];

    const sholawatList = [
        "Sahhudin",
        "Rimadip",
        "Sudip",
        "Ujiadi",
        "Sansedip",
        "Kamardi",
        "Sutahar",
        "Mizanul Khairi",
        "Sopian Hadi",
        "Kertidep",
        "Ari",
        "Sulhadi",
        "Riwati"
    ];

    const sodaqohList = [
        "Sri Safaatun","Umul","Ayu","Pao","Nadia","Farida","Uni","Rida",
        "Lisda","Tina","Mar","Yurni","Marhamah","Rismah","Mery","Aminah",
        "Irtip","Suh","Ema","War","Rayuni","Susi","Kartini","Nila",
        "Sarkip","Segianep","Sir","Srinatip","Widiya","Mus","Riani",
        "Satip","Siti","Nurmini","Desi","Roh/Wahadi"
    ];

    let jadwalCards = "";
    let jadwalTableRows = "";

    // =============================
    // 3. GENERATE 30 MALAM
    // =============================

    for (let i = 0; i < 30; i++) {

        const malamKe = i + 1;
        const imam = imamList[i % imamList.length];
        const sholawat = sholawatList[i % sholawatList.length];

        // Ambil 4 orang sodaqoh per malam (looping)
        let sodaqohMalam = [];
        for (let j = 0; j < 4; j++) {
            let index = (i * 4 + j) % sodaqohList.length;
            sodaqohMalam.push(sodaqohList[index]);
        }

        const sodaqohText = sodaqohMalam.join(", ");

        // CARD
        jadwalCards += `
            <div class="col-md-4 mb-4 jadwal-card">
                <div class="card text-center p-3 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title text-primary">Malam ke-${malamKe}</h5>
                        <p class="card-text"><strong>Imam:</strong> ${imam}</p>
                        <p class="card-text"><strong>Sholawat:</strong> ${sholawat}</p>
                        <p class="card-text"><strong>Sodaqoh:</strong> ${sodaqohText}</p>
                    </div>
                </div>
            </div>`;

        // TABLE ROW (UNTUK EXPORT)
        jadwalTableRows += `
            <tr>
                <td>${malamKe}</td>
                <td>${imam}</td>
                <td>${sholawat}</td>
                <td>${sodaqohText}</td>
            </tr>`;
    }

    container.innerHTML = jadwalCards;
    exportTableBody.innerHTML = jadwalTableRows;

    // =============================
    // 4. EXPORT EXCEL
    // =============================

    function exportExcel() {
        if (typeof saveAs !== 'function') {
            alert("FileSaver.js tidak dimuat.");
            return;
        }

        const table = document.getElementById("exportTable");
        let rows = [];

        const header = Array.from(table.tHead.rows[0].cells).map(cell => cell.innerText);
        rows.push(header.join('\t'));

        for (let i = 0; i < table.tBodies[0].rows.length; i++) {
            const row = table.tBodies[0].rows[i];
            const rowData = Array.from(row.cells).map(cell => cell.innerText);
            rows.push(rowData.join('\t'));
        }

        const blob = new Blob(["\uFEFF" + rows.join('\n')], {
            type: 'text/csv;charset=utf-8;'
        });

        saveAs(blob, 'Jadwal_Ramadhan_Excel.xls');
    }

    // =============================
    // 5. EXPORT PDF
    // =============================

    function exportPDF() {
        if (typeof jspdf === 'undefined') {
            alert("jsPDF tidak dimuat.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'pt', 'a4');

        doc.setFontSize(14);
        doc.text("Jadwal Imam, Sholawat & Sodaqoh", doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });

        doc.autoTable({
            html: '#exportTable',
            startY: 70,
            theme: 'striped',
            styles: { fontSize: 8 }
        });

        doc.save('Jadwal_Ramadhan.pdf');
    }

    if (exportExcelBtn) exportExcelBtn.addEventListener("click", exportExcel);
    if (exportPdfBtn) exportPdfBtn.addEventListener("click", exportPDF);

    // =============================
    // 6. SEARCH FILTER
    // =============================

    searchInput.addEventListener("keyup", function () {
        let filter = searchInput.value.toLowerCase();
        let cards = document.querySelectorAll(".jadwal-card");

        cards.forEach(card => {
            let text = card.innerText.toLowerCase();
            card.style.display = text.includes(filter) ? "block" : "none";
        });
    });

});