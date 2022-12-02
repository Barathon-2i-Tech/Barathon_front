import { Formik } from 'formik';
import * as yup from 'yup';
import { Box, Button, TextField } from '@mui/material';
import axios from 'axios';
//import Stepper from "../CommonComponents/Stepper";
import { useContext } from 'react';
import { FormContext } from './Register';

export default function RegisterPro() {
    const { formData, setFormData } = useContext(FormContext);

    const initialValues = {
        siren: '',
        kbis: '',
    };

    const barathonienSchema = yup.object().shape({
        siren: yup.string().required('Siren obligatoire'),
        kbis: yup.string().required('Kbis obligatoire'),
    });

    const handleFormSubmit = (values, actions) => {
        const data = { ...formData, ...values };
        setFormData(data);
        console.log(data);

        axios
            .post('http://localhost/api/register/owner', data)
            .then((response) => {
                console.log(response.data);
                actions.resetForm();
            })
            .catch((err) => {
                if (err & err.response) console.log('Error: ', err);
            });
    };

    return (
        <div className="min-h-screen flex flex-col justify-start items-center sm:pt-0 registerWrapper">
            <div className="w-full sm:max-w-lg sm:mt-6 sm:px-6 py-4 bg-white md:shadow-lg overflow-hidden sm:rounded-lg z-10">
                <Box m="20px">
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleFormSubmit}
                        validationSchema={barathonienSchema}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <Box
                                    display="grid"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0,1 fr))"
                                >
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="Siren"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.siren}
                                        name="siren"
                                        //convert to boolean using !! operator
                                        error={!!touched.siren && !!errors.siren}
                                        helperText={touched.siren && errors.siren}
                                        sx={{ gridColumn: 'span 2' }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="text"
                                        label="K-bis"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.kbis}
                                        name="kbis"
                                        //convert to boolean using !! operator
                                        error={!!touched.kbis && !!errors.kbis}
                                        helperText={touched.kbis && errors.kbis}
                                        sx={{ gridColumn: 'span 2' }}
                                    />
                                </Box>
                                <Box display="flex" justifyContent="end" mt="20px">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        className="sm:ml-4 mt-7 sm:mt-0 mb-7 sm:mb-0 bg-cyan-800 text-base"
                                    >
                                        S inscrire
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Box>
            </div>
        </div>
    );
}
