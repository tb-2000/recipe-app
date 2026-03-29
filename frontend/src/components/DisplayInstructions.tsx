import '../App.css'

export default function DisplayInstructions({ instructions }:{ instructions:any }){

    if(!instructions || typeof instructions !== "string"){
        return <p>keine Anleitung erhalten</p>
    }

    // split instructions by /n and filter zero lines
    const instrArray = instructions.split("\n").map((line:string) => line.trim()).filter((line: string) => line !== "")
    console.log("1st instrArray-Element: ", instrArray[0])

    return(
        <div style={{width:"600px", gap:"30px", marginLeft:"auto", marginRight:"auto"}}>
            {instrArray.map((line, index) => {
                return (
                    <div key={index} className={index % 2 === 0 ? "instructions-even" : "instructions-odd"}>
                        {line}
                    </div>
                ) 
            })}
        </div>
    )
}