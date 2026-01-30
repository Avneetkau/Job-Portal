import React, { useContext, useEffect, useState } from 'react';

import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

const ManageJobs = () => {

    const navigate = useNavigate();

    const [jobs, setJobs] = useState(false);
    const {backendUrl, companyToken} = useContext(AppContext);
    const [deleteId, setDeleteId] = useState(null);

    //function to fetch company job application data
    const fetchCompanyJobs = async () => {
      try{
           const {data} = await axios.get(backendUrl + '/api/company/list-jobs',{
            headers:{token:companyToken}
           })
           if(data.success){
            setJobs(data.jobsData.reverse())
            console.log(data.jobsData)
           }else{
            toast.error(data.message)
           }
      }catch(error){
         toast.error(error.message)
      }
    }

       //function to change visibility
       const changeJobVisibility = async (id) => {
              try {
                const {data} = await axios.post(backendUrl + '/api/company/change-visibility',
                  {id},
                  {headers:{token:companyToken}}
                )
                if(data.success){
                  toast.success(data.message)
                  fetchCompanyJobs()
                }else{
                  toast.error(data.message)
                }
              } catch (error) {
                toast.error(error.message)
              }
       }
     



    useEffect(()=>{
      if(companyToken){
        fetchCompanyJobs();
      }
    },[companyToken])

  return jobs ? jobs.length === 0 ? (
  <div className='flex items-center justify-center h-[70vh]'>
    <p className='text-xl sm:text-2xl'>No jobs Available or posted</p>
  </div>
  ):(
    <>
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
          <thead className=''>
          <tr className=''>
            <th className='py-2 px-4 border-b text-left max-sm:hidden'>#</th>
            <th className='py-2 px-4 border-b text-left'>Job Title</th>
            <th className='py-2 px-4 border-b text-left max-sm:hidden'>Date</th>
            <th className='py-2 px-4 border-b text-left max-sm:hidden'>Location</th>
            <th className='py-2 px-4 border-b text-center'>Applicants</th>
            <th className='py-2 px-4 border-b text-left'>Visible</th>
            <th className='py-2 px-4 border-b text-left'>Delete</th>
            </tr>
          </thead>

          <tbody>
            {jobs.map((job, index)=>(
              <tr key={index} className='text-gray-700'>
                <td className='py-2 px-4 border-b max-sm:hidden'>{index+1}</td>
                <td className='py-2 px-4 border-b'>{job.title}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{moment(job.date).format('ll')}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{job.location}</td>
                <td className='py-2 px-4 border-b text-center'>{job.applicants}</td>
                <td className='py-2 px-4 border-b'>
                    <input onChange={()=>changeJobVisibility(job._id)}
                    className='scale-125 ml-4' type='checkbox' checked = {job.visible}/>
                </td>
                <td className='py-2 px-4 border-b'>
                  <button
    onClick={() => setDeleteId(job._id)}
  className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded'
  >
    Delete
  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

          <div className='mt-4 flex justify-end'>
            <button onClick={(e)=>navigate('/dashboard/add-jobs')}className='bg-black text-white py-2 px-4 rounded'>Add new Job</button>
          </div>

    </div>

     {/* ===== DELETE MODAL ===== */}
    {deleteId && (
      <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
        <div className="bg-white border-2 border-red-500   rounded-lg p-6 w-[90%] max-w-sm">
          <h2 className="text-lg font-semibold mb-2">Delete Job?</h2>
          <p className="text-sm text-gray-600 mb-4">
            This will permanently remove the job and all applications.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  const { data } = await axios.post(
                    backendUrl + "/api/company/delete-job",
                    { id: deleteId },
                    { headers: { token: companyToken } }
                  );
                  if (data.success) {
                    toast.success(data.message);
                    fetchCompanyJobs();
                  } else {
                    toast.error(data.message);
                  }
                } catch (error) {
                  toast.error(error.message);
                }
                setDeleteId(null);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  ): <Loading/>
}

export default ManageJobs;
