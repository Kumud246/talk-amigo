import React,{useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import Navbar from "../components/Navbar";


function CreatePost() {
  const history = useHistory("");
  const [title, setTitle] = useState("");
  const [body , setBody] = useState("");
  const [img , setImg] = useState("");
  const [url, setUrl] = useState("");
  let [error , setError]= useState("");


  useEffect(() => {
if(url){
    fetch("http://localhost:5000/posts/createpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer "+ localStorage.getItem("jwt")
        },
        body: JSON.stringify({
        title,
        body,
        photo : url
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
              console.log(data.error);
          setError(data.error);
          } else {
            console.log(data.message);
            history.push("/");
          }
        })
        .catch((err) => {
            setError(err);
          console.log(err);
        });
}
  }, [url])
  const post = () => {
      const data = new FormData;
      data.append("file", img);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "talk-amigo")

      fetch("https://api.cloudinary.com/v1_1/talk-amigo/image/upload", {
          method : "post",
          body : data
      })
      .then(res =>res.json())
      .then(data => setUrl(data.url))
      .catch(err => console.log(err));

  

  }

    return (
        <div className="container-fluid stardust-bg">
            <Navbar />
            <div className="container">
                <div className="row "> <div className="col-md-4 offset-md-4">
                    <div className="card text-white bg-transparent create-post-card"  >
                        <div className="card-header">
                            Create Post
                    </div>
                        <div className="card-body">
                            

                                <div className="form-group text-left  ">
                                    <input type="text" className="form-control create-post-input" id="title"
                                        placeholder="title" value= {title} onChange={(e)=>setTitle(e.target.value)} />
                                </div>

                                <div className="form-group text-left  ">
                                    <input type="textarea" className="form-control create-post-input" id="body"
                                        placeholder="body" value={body} onChange={(e)=> setBody(e.target.value)} />
                                </div>

                                <div className="form-group text-left  ">
                                    <label>Upload Image: </label>
                                    <input type="file"   onChange={(e)=>setImg(e.target.files[0])} />
                                </div>

                                <button   onClick={() => post()} className="btn btn-lg  login-register-button">
                                     POST
                    </button>

                            


                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePost;