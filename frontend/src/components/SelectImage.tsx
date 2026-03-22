import { useState, useCallback } from "react"
import { useDropzone } from 'react-dropzone'
import '../App.css'

interface SelectImageProps {
  handleImage: (file: File) => void;
}

export default function SelectImage({ handleImage }: SelectImageProps) {
    const [image, setImage] = useState<File | null>(null)

    const onDrop = useCallback((acceptedFile: File[]) => {
        console.log("Image URL: ", acceptedFile[0])
        console.log("Image name: ", acceptedFile[0].name)
        const file = acceptedFile[0]
        setImage(file)
        handleImage(file)
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept:  {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
    })
    return (
        <div>
            <h3>select image by Drag and Drop:</h3>
            <div {...getRootProps()} className="DragDrop-Container">
                <input {...getInputProps()}/>
                {isDragActive ? (
                    <p>Bild hier ablegen</p>
                ) : (
                    <div>
                        <p>Bild hierher ziehen</p>
                        <p>oder hier draufklicken für Dateienauswahl</p>
                        <p>PNG, JPG, JPEG, WEBP</p>
                        <p>nur 1 Bild auswählen</p>
                    </div>
                )}
            </div>
            {image && <img src={URL.createObjectURL(image)} alt="Preview von Bild" style={{width:400, height:300}}/>}
            <div>
                <button type="button" onClick={()  => setImage(null)}>Delete Picture</button>
            </div>
        </div>
    )
}