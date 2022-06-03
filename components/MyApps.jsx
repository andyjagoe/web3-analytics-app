import useMyApps from "../hooks/useMyApps.jsx"

const MyApps = () => {
    const {myApps, isLoading} = useMyApps()
    
    return (
        <>
            {!isLoading && myApps.Items?.map((item) => 
                (
                    <div key={item.slug}>{item.slug}</div>
                ))
                }   
            
        </>
    )
}

export default MyApps;  