import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import "../CSS/AddProduct.css"

const AddProducts=() => {
    const [form, setForm] = useState({ptitle: "",pmodel_no: "",pdescription: "",pprice: ""})

    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)

    const handleChange=(e)=>{
        setForm({...form,[e.target.name]:e.target.value})
    }

    // Handle image
    const handleImage = (e) => {
        const file = e.target.files[0]
        setImage(file)
        // preview
        if (file) {
            setPreview(URL.createObjectURL(file))
        }
    }

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!image) {
            return toast.error("Please select an image")
        }
        try {
            const formData = new FormData()
            formData.append("pimage", image)
            formData.append("ptitle", form.ptitle)
            formData.append("pmodel_no", form.pmodel_no)
            formData.append("pdescription", form.pdescription)
            formData.append("pprice", form.pprice)

            const res = await axios.post("http://localhost:5000/api/products/addproduct",formData)
            toast.success(res.data.msg)
            setForm({ptitle: "",pmodel_no: "",pdescription: "",pprice: ""})
            setImage(null)
            setPreview(null)

        }catch(err){
            toast.error(err.response?.data?.msg || "Error adding product")
        }
    }

    return (
        <div className="container">

            <h1 className="heading" style={{marginLeft:"10px", padding:"30px"}}>Add Product</h1>
            <form onSubmit={handleSubmit} className="form-box">
                <input type="text" name="ptitle" placeholder="Product Title" value={form.ptitle} onChange={handleChange} required />
                <input type="text" name="pmodel_no" placeholder="Model Number" value={form.pmodel_no} onChange={handleChange} required />
                <textarea name="pdescription" placeholder="Description" value={form.pdescription} onChange={handleChange} required />
                <input type="text" name="pprice" placeholder="Price" value={form.pprice} onChange={handleChange} required />
                <input type="file" accept="image/*" onChange={handleImage} />

                {preview && <img src={preview} alt="preview" className="preview-img" />}

                <button type="submit" className="btn">Add Product</button>
            </form>
        </div>
    )
}

export default AddProducts