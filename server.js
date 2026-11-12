<<<<<<< HEAD
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/translate', async (req, res) => {
  const { text, sourceLang = 'auto', targetLang = 'en' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Metin gereklidir.' });
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();

    // Google API parçalı yanıt döner, tüm cümleleri birleştiriyoruz
    const translatedText = data[0].map(item => item[0]).join('');
    const detectedSource = data[2] || sourceLang;

    res.json({ 
      translatedText, 
      detectedSource 
    });
  } catch (error) {
    res.status(500).json({ error: 'Çeviri servisinde bir hata oluştu.' });
  }
});

app.listen(PORT, () => {
  console.log(`Uygulama yayında: http://localhost:${PORT}`);
=======
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/translate', async (req, res) => {
  const { text, sourceLang = 'auto', targetLang = 'en' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Metin gereklidir.' });
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    const data = await response.json();

    // Google API parçalı yanıt döner, tüm cümleleri birleştiriyoruz
    const translatedText = data[0].map(item => item[0]).join('');
    const detectedSource = data[2] || sourceLang;

    res.json({ 
      translatedText, 
      detectedSource 
    });
  } catch (error) {
    res.status(500).json({ error: 'Çeviri servisinde bir hata oluştu.' });
  }
});

app.listen(PORT, () => {
  console.log(`Uygulama yayında: http://localhost:${PORT}`);
>>>>>>> e4103121aaa96aaed50a8b4e878a145d33f1e1ba
});