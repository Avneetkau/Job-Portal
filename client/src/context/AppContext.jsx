import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    //for hero section job and loaction
    const [searchFilter,setSearchFilter] = useState(
        {
            title:'',
            location:''
        }
    )
    //it will become true when search is done
    const [isSearched,setIsSearched] = useState(false);

    const [jobs, setJobs] = useState([]);

   const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

    //function to fetch jobs
    const fetchJobs = async  () => {
     setJobs(jobsData);
    }
    useEffect(()=>{
        fetchJobs();
    },[])
 
const value = {
  searchFilter,setSearchFilter,isSearched,setIsSearched,jobs,setJobs,showRecruiterLogin, setShowRecruiterLogin
}
return (<AppContext.Provider value={value}>
    {props.children}
</AppContext.Provider>)

}