const express = require('express');
const app = express();

app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error.',
    });
});

const fs = require('fs');

// Endpoint POST untuk pembayaran
app.post('/pay-dana', (req, res) => {
    const { name, address, amount, ewallet, phoneNumber } = req.body;

    if (!name || !address || !amount || !ewallet || !phoneNumber) {
        return res.status(400).json({
            success: false,
            message: 'Semua field harus diisi.',
        });
    }

    if (ewallet === 'dana' && phoneNumber === '0895320004955') {
        const paymentId = 'DANA-' + Date.now();

        // Simpan transaksi ke dalam file log
        const logEntry = {
            paymentId,
            name,
            address,
            amount,
            ewallet,
            phoneNumber,
            timestamp: new Date().toISOString(),
        };

        fs.appendFileSync('payments-log.json', JSON.stringify(logEntry) + '\n');

        return res.status(200).json({
            success: true,
            message: 'Pembayaran berhasil diproses melalui Dana.',
            paymentId,
        });
    } else {
        return res.status(400).json({
            success: false,
            message: 'Informasi pembayaran tidak valid.',
        });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
