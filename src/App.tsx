import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import './App.css'
import { Form } from 'react-bootstrap'
import { DicomFile } from './adapters/DicomLoader';

function App() {
  const [dicomFile, setDicomFile] = useState<DicomFile>();

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      file?.arrayBuffer().then(fileData => {
        const dicomFile = new DicomFile(fileData)
        setDicomFile(dicomFile);
      })
    }
  }, []);

  useEffect(() => {
    console.log("🚀 ~ App ~ dicomFile:", dicomFile)
  }, [dicomFile])

  return (
      <div>
        <Form.Control type="file" onChange={handleFileChange} />
      </div>
  )
}

export default App
