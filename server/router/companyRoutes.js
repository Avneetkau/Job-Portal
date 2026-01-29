import express from 'express';
import { Router } from 'express';
import { changeJobApplicationsStatus, changeVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controller/companyController.js';
import upload from '../config/multer.js';
import { protectCompany } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/register', upload.single('image'), registerCompany);

//company login
router.post('/login',loginCompany);

//get company data
router.get('/company',protectCompany, getCompanyData);

//Post a job
router.post('/post-job',protectCompany, postJob);

//get applicants data of company
router.get('/applicants',protectCompany, getCompanyJobApplicants);

//get company job lists
router.get('/list-jobs',protectCompany, getCompanyPostedJobs);

//change pplication status
router.post('/change-status',protectCompany, changeJobApplicationsStatus);

//change application visibility
router.post('/change-visibility',protectCompany, changeVisibility);


export default router;
