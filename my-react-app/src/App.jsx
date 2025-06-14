import React, { useState } from 'react';
// Material UI imports
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Slider,
  TextField,
  Button,
  Paper,
  Divider
} from '@mui/material';

function App() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file1Content, setFile1Content] = useState('');
  const [file2Content, setFile2Content] = useState('');
  const [threshold, setThreshold] = useState(0.7);
  const [result, setResult] = useState(null);

  // Helper to read file as text
  const readFileAsText = (file, callback) => {
    if (!file) return callback('');
    const reader = new window.FileReader();
    reader.onload = e => callback(e.target.result);
    reader.readAsText(file);
  };

  // Simple similarity (Jaccard index for demonstration)
  const getSimilarity = (a, b) => {
    if (!a || !b) return 0;
    const setA = new Set(a.split(/\s+/));
    const setB = new Set(b.split(/\s+/));
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return union.size === 0 ? 0 : intersection.size / union.size;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle file reading
    const readFiles = () =>
      new Promise((resolve) => {
        let file1Text = '', file2Text = '';
        let filesRead = 0;

        readFileAsText(file1, text => {
          file1Text = text;
          filesRead += 1;
          if (filesRead === 2) resolve([file1Text, file2Text]);
        });

        readFileAsText(file2, text => {
          file2Text = text;
          filesRead += 1;
          if (filesRead === 2) resolve([file1Text, file2Text]);
        });

        // If both files are null
        if (!file1 && !file2) resolve(['', '']);
      });

    const [f1Content, f2Content] = await readFiles();
    setFile1Content(f1Content);
    setFile2Content(f2Content);

    // Calculate similarities
    const text_similarity = getSimilarity(text1, text2);
    const text_plagiarism = (text1 && text2) ? text_similarity >= threshold : null;

    const file_similarity = getSimilarity(f1Content, f2Content);
    const file_plagiarism = (f1Content && f2Content) ? file_similarity >= threshold : null;

    setResult({
      text1,
      text2,
      text_similarity,
      text_plagiarism,
      file1_content: f1Content,
      file2_content: f2Content,
      file_similarity,
      file_plagiarism,
    });
  };

  // For Material UI slider marks
  const marks = [
    { value: 0, label: '0' },
    { value: 0.25, label: '0.25' },
    { value: 0.5, label: '0.5' },
    { value: 0.75, label: '0.75' },
    { value: 1, label: '1' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f4f8' }}>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ background: 'linear-gradient(120deg, #1976d2 0%, #42a5f5 100%)', mb: 4 }}>
        <Toolbar>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            Plagiarism Checker
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          maxWidth: 700,
          margin: '40px auto',
          fontFamily: 'Arial, sans-serif',
          p: 3,
        }}
      >
        <Paper elevation={6} sx={{ p: 3, borderRadius: 4, background: 'linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
          <Typography variant="h3" gutterBottom color="primary" align="center" sx={{ fontWeight: 700 }}>
            Text & File Plagiarism Checker
          </Typography>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Box className="section" sx={{ mb: 3 }}>
              <Typography variant="h5" color="secondary" sx={{ fontWeight: 600 }}>
                Compare Texts
              </Typography>
              <TextField
                label="Text 1"
                multiline
                minRows={3}
                maxRows={8}
                fullWidth
                margin="normal"
                value={text1}
                onChange={e => setText1(e.target.value)}
                sx={{ background: "#fff", borderRadius: 2 }}
              />
              <TextField
                label="Text 2"
                multiline
                minRows={3}
                maxRows={8}
                fullWidth
                margin="normal"
                value={text2}
                onChange={e => setText2(e.target.value)}
                sx={{ background: "#fff", borderRadius: 2 }}
              />
            </Box>
            <Box className="section" sx={{ mb: 3 }}>
              <Typography variant="h5" color="secondary" sx={{ fontWeight: 600 }}>
                Compare Files (.txt)
              </Typography>
              <Typography sx={{ mt: 2 }}>File 1:</Typography>
              <input
                type="file"
                accept=".txt"
                onChange={e => setFile1(e.target.files[0] || null)}
                style={{ margin: "8px 0" }}
              />
              <Typography sx={{ mt: 2 }}>File 2:</Typography>
              <input
                type="file"
                accept=".txt"
                onChange={e => setFile2(e.target.files[0] || null)}
                style={{ margin: "8px 0" }}
              />
            </Box>
            <Box sx={{ mb: 3, px: 2, py: 2, bgcolor: "#e3f2fd", borderRadius: 2 }}>
              <Typography gutterBottom sx={{ fontWeight: 500 }}>
                Similarity Threshold ({threshold.toFixed(2)})
              </Typography>
              <Slider
                value={threshold}
                min={0}
                max={1}
                step={0.01}
                onChange={(e, v) => setThreshold(v)}
                marks={marks}
                valueLabelDisplay="auto"
                sx={{
                  color: "primary.main",
                  height: 8,
                  '& .MuiSlider-thumb': {
                    height: 24,
                    width: 24,
                    backgroundColor: '#fff',
                    border: '2px solid #1976d2',
                  },
                  '& .MuiSlider-track': {
                    border: 'none',
                  },
                  '& .MuiSlider-rail': {
                    opacity: 0.5,
                    backgroundColor: '#bfbfbf',
                  },
                }}
              />
            </Box>
            <Box textAlign="center">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                sx={{
                  borderRadius: 3,
                  px: 6,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: 18,
                  boxShadow: 3,
                  textTransform: "none"
                }}
              >
                Check Plagiarism
              </Button>
            </Box>
          </form>

          {result && (
            <>
              <Divider sx={{ my: 4 }} />
              <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 700 }}>
                Results
              </Typography>
              {result.text1 && result.text2 && (
                <Box sx={{ mb: 3, p: 2, bgcolor: "#f3e5f5", borderRadius: 2 }}>
                  <Typography variant="h6" color="secondary" sx={{ fontWeight: 600 }}>
                    Text-to-Text Similarity
                  </Typography>
                  <Typography>Similarity: <b>{result.text_similarity.toFixed(3)}</b></Typography>
                  <Typography>
                    Plagiarism Detected?{' '}
                    {result.text_plagiarism !== null
                      ? <b style={{ color: result.text_plagiarism ? "#d32f2f" : "#388e3c" }}>{result.text_plagiarism ? 'Yes' : 'No'}</b>
                      : <b>N/A</b>}
                  </Typography>
                </Box>
              )}
              {result.file1_content && result.file2_content && (
                <Box sx={{ mb: 3, p: 2, bgcolor: "#e1f5fe", borderRadius: 2 }}>
                  <Typography variant="h6" color="secondary" sx={{ fontWeight: 600 }}>
                    File-to-File Similarity
                  </Typography>
                  <Typography>Similarity: <b>{result.file_similarity.toFixed(3)}</b></Typography>
                  <Typography>
                    Plagiarism Detected?{' '}
                    {result.file_plagiarism !== null
                      ? <b style={{ color: result.file_plagiarism ? "#d32f2f" : "#388e3c" }}>{result.file_plagiarism ? 'Yes' : 'No'}</b>
                      : <b>N/A</b>}
                  </Typography>
                  <details style={{ marginTop: 10 }}>
                    <summary style={{ cursor: 'pointer', fontWeight: 500 }}>Show File 1 Content</summary>
                    <Box component="pre" sx={{ background: '#f7f7f7', p: 2, borderRadius: 2, fontSize: 15, whiteSpace: 'pre-wrap' }}>
                      {result.file1_content}
                    </Box>
                  </details>
                  <details>
                    <summary style={{ cursor: 'pointer', fontWeight: 500 }}>Show File 2 Content</summary>
                    <Box component="pre" sx={{ background: '#f7f7f7', p: 2, borderRadius: 2, fontSize: 15, whiteSpace: 'pre-wrap' }}>
                      {result.file2_content}
                    </Box>
                  </details>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default App;