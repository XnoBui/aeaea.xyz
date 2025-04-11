const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// ✅ Serve video with streaming support
app.get('/videos/:filename', (req, res) => {
	const videoPath = path.join(__dirname, 'videos', req.params.filename);

	fs.stat(videoPath, (err, stats) => {
		if (err || !fs.existsSync(videoPath)) {
			console.error('Video not found:', err);
			return res.sendStatus(404);
		}

		const range = req.headers.range;
		if (!range) {
			return res.status(416).send('Requires Range header');
		}

		const videoSize = stats.size;
		const start = Number(range.replace(/\D/g, ''));
		const CHUNK_SIZE = 1 * 1024 * 1024;
		const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

		const contentLength = end - start + 1;
		const headers = {
			'Content-Range': `bytes ${start}-${end}/${videoSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': contentLength,
			'Content-Type': 'video/mp4',
		};

		res.writeHead(206, headers);
		const stream = fs.createReadStream(videoPath, { start, end });
		stream.pipe(res);
	});
});

// Fallback route
app.use((req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
	console.log(`Server is running on port ${port}`);
});