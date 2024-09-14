import React,{useState} from "react";



function F(){
    let table = [10,11,11,34,65];

    const [ele, setEle] = useState(table);

    function handleClick(id){
        const updated = ele.filter((_,item) => item !== id);
        setEle(updated);
    }
    return(
        <>
        {
            ele.map((item,index) => (
                <div 
                style={{
                    padding: "10px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    width: "50px",
                    textAlign: "center",
                  }}
                onClick={() => handleClick(index)} key = {index}> {item} </div>
            ))
        }
        </>
    );
}


export default F;