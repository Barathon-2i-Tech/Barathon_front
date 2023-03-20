import { BasicPage } from '../../Components/CommonComponents/BasicPage';
import BusinessIcon from '@mui/icons-material/Business';
import Paper from '@mui/material/Paper';
import '../../css/Professional/Establishment.css';
import '../../css/Professional/Loader.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../../Components/Hooks/useAuth';
import {
    EstablishmentSchemaOpening,
    establishmentSchema,
    selectCategoriesSchema,
} from '../../utils/FormSchemaValidation';
import { Grid, Box, InputLabel, Select, MenuItem } from '@mui/material';
import { FormInitialValuesOpening } from '../../utils/FormInitialValue';
import { useFormik, Formik } from 'formik';
import { FormOpening } from '../../Components/CommonComponents/FormsComponent/FormOpening';
import { FormFieldModel } from '../../Components/CommonComponents/FormsComponent/FormFieldModel';
import { sendFormDataPut } from '../../utils/AxiosModel';
import { ToastForm } from '../../Components/CommonComponents/Toast/ToastForm';
import Axios from '../../utils/axiosUrl';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader } from '../../Components/CommonComponents/Loader';
import Parser from 'html-react-parser';

export default function EstablishmentCreatePage() {
    const [openSnackbarOpening, setOpenSnackbarOpening] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const { user } = useAuth();
    const token = user.token;
    const ownerId = user.userLogged.owner_id;
    const [establishment, setEstablishment] = useState([]);
    const [opening, setOpening] = useState({});
    const [openingFormat, setOpeningFormat] = useState({});
    const [allCategories, setAllCategories] = useState([]);
    const [establishmentCategories, setEstablishmentCategories] = useState([]);
    const [categoriesSelected, setCategoriesSelected] = useState([]);
    const openingJson = JSON.stringify(
        Object.entries(opening).reduce(
            (acc, [key, value]) => ({ ...acc, [key.toLowerCase()]: value }),
            {},
        ),
    );
    const { id } = useParams();
    const establishmentId = parseInt(id);
    const navigate = useNavigate();

    // This function is used to navigate to the home page
    // It will be called when the button is clicked
    const goBack = () => {
        navigate('/pro/establishment');
    };
    // This function is used to close toast
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
        setOpenSnackbarOpening(false);
    };

    // AXIOS GET
    // This function is used to get the establishment to update by his ID
    async function getEstablishment() {
        try {
            const response = await Axios.api.get(`/pro/${ownerId}/establishment/${id}`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setEstablishment(response.data.data);
            await new Promise((resolve) => setTimeout(resolve)); // Attendre un tick pour laisser le temps à React de mettre à jour l'interface utilisateur
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.remove('display');
            }
        } catch (error) {
            console.log(error);
        }
    }
    // This function is used to get All categories in database (who has sub_category ALL and Establishment)
    async function getAllCategories() {
        try {
            const response = await Axios.api.get(`/categories/establishment`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setAllCategories(response.data.data);
            // console.table(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }
    // This function is used to get All categories of The establishment to update
    async function getEstablishmentCategory() {
        try {
            const response = await Axios.api.get(`/categories/establishment/${establishmentId}`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${token}`,
                },
            });
            //formikCategories.setValues(response.data.data);
            setEstablishmentCategories(response.data.data);
            // console.table(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    // This const is to initialize initial option value with the categories of establishment in DB
    const getInitialOptions = (categories) => {
        return categories && categories.length > 0
            ? categories.map((category) => category.category_id)
            : [];
    };

    // const getInitialOpening = (openings) => {
    //     return openings && openings.length > 0
    //         ? openings.map((day) => day.opening)
    //         : [];
    // };

    // FORMIK
    // This const is for formik shema and action to form Opening
    const formikCategories = useFormik({
        initialValues: {
            options: [],
        },
        enableReinitialize: true,
        validationSchema: selectCategoriesSchema,
        onSubmit: (values) => handleFormSubmitCategories(values),
    });
    // This const is for formik shema and action to form Opening
    const formikOpening = useFormik({
        initialValues: FormInitialValuesOpening,
        enableReinitialize: true,
        validationSchema: EstablishmentSchemaOpening,
        onSubmit: (values) => handleFormSubmitOpening(values),
    });

    // FUNCTION SUBMIT
    // This const is to save in state establishmentsCategories the news categories
    const handleFormSubmitCategories = (values) => {
        //toast MUI
        setOpenSnackbarOpening(true);

        // Mettre à jour les catégories de l'établissement
        const updatedCategories = allCategories.filter((category) =>
            values.options.includes(category.category_id),
        );
        const updatedCategoryIds = updatedCategories.map((category) => category.category_id);

        console.log('updatedCategories:', updatedCategories);
        console.log('options:', values.options);
        console.log('establishmentCategories:', establishmentCategories);

        // avoir la liste des categories selectionner en state pour les lister
        setCategoriesSelected(updatedCategories);

        // Créer l'objet avec la propriété "option"
        const optionObj = { option: updatedCategoryIds };
        setEstablishmentCategories(optionObj);

        // Mettre à jour les options sélectionnées dans formikCategories.values
        const newOptions = values.options.concat(updatedCategoryIds);
        formikCategories.setValues({
            ...formikCategories.values,
            options: newOptions,
        });
    };

    // This const is to save in state opening the news opening
    const handleFormSubmitOpening = (values) => {
        //toast MUI
        setOpenSnackbarOpening(true);

        const dataValuesOpening = { ...values };
        setOpening(dataValuesOpening);
        // console.log('OPENING establishmentCategories:', establishmentCategories);
    };
    useEffect(() => {
        getEstablishment();
        getAllCategories();
        console.log(establishment);
    }, []);

    useEffect(() => {
        setOpeningFormat(openingJson);
    }, [opening]);

    useEffect(() => {
        getEstablishmentCategory();
        getInitialOptions(establishmentCategories);
        // console.table(establishmentCategories);
    }, []);

    useEffect(() => {
        formikCategories.setValues({
            options: getInitialOptions(establishmentCategories),
        });
    }, [establishmentCategories]);

    const handleFormSubmit = (values) => {
        const dataValues = { ...values, opening: openingFormat };
        const urlCreate = `/pro/${ownerId}/establishment/${id}`;

        const dataValuesCategories = { ...establishmentCategories };
        const urlCreateCategories = `/pro/establishment/${id}/category`;
        console.log('dataValuesCategories post:', dataValuesCategories);
        console.log('establishmentCategories post:', establishmentCategories);

        console.log(dataValues);
        sendFormDataPut(urlCreate, token, dataValues) // Appel de la fonction
            .then(() => {
                //toast MUI
                setOpenSnackbar(true);
                //console.table(dataValues);
            })
            .catch((e) => {
                console.error(e);
                alert('Une erreur est survenue. Merci de réessayer');
                //console.table(dataValues);
            });

        sendFormDataPut(urlCreateCategories, token, dataValuesCategories) // Appel de la fonction
            .then(() => {
                //toast MUI
                setOpenSnackbar(true);
                // console.table(dataValuesCategories);
            })
            .catch((e) => {
                console.error(e);
                alert('Une erreur est survenue. Merci de réessayer');
                // console.table(dataValuesCategories);
            });
    };

    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: '80vh',
                width: '100%',
            }}
        >
            <ToastForm
                openSnackbar={openSnackbarOpening}
                handleSnackbarClose={handleSnackbarClose}
                title={'Bravo !'}
                message={'Bien enregisté - Continuez et enregistrez'}
            />
            <ToastForm
                openSnackbar={openSnackbar}
                handleSnackbarClose={handleSnackbarClose}
                title={'Felicitation !'}
                message={'Bien envoyez'}
            />

            <BasicPage title="Modifier mon etablissement" icon={<BusinessIcon />} />

            <section className="container mx-auto relative sm:pt-6 md:pt-11 px-4 z-10">
                <div className="mx-6 font-bold text-xl">
                    1ere ETAPE (facultative): modifier tous les champs de la semaine et enregister,
                    puis sauvegarder si vous modifiez uniquement les horaires, sinon passez à la
                    prochaine étape.
                </div>
                <Box m="20px">
                    <div className="categorie-title text-2xl text-teal-700 font-bold">
                        CATEGORIES DE VOTRE ETABLISSMENT :
                    </div>
                    <form className="py-4 sm:pb-4" onSubmit={formikCategories.handleSubmit}>
                        <InputLabel id="options-label">Categories</InputLabel>
                        <Select
                            labelId="options-label"
                            id="options"
                            style={{ minWidth: 120 }}
                            multiple
                            defaultValue={formikCategories.initialValues.options}
                            value={formikCategories.values.options}
                            onChange={formikCategories.handleChange}
                            inputProps={{
                                name: 'options',
                            }}
                        >
                            {allCategories.map((allEstablishment) => {
                                const categoryDetails = JSON.parse(
                                    allEstablishment.category_details,
                                );

                                return (
                                    <MenuItem
                                        key={allEstablishment.category_id}
                                        value={allEstablishment.category_id}
                                    >
                                        {categoryDetails.label}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        <button
                            type="submit"
                            className="sm:ml-7 mt-7 ml-2 sm:mt-0 mb-7 sm:mb-0 bg-teal-700 text-white font-bold"
                        >
                            Enregistrer mon/mes Categories
                        </button>
                    </form>
                    <div className="categories_selected-container flex sm:pb-10">
                        <div className="font-bold pr-4 text-base">CATEGORIES ENREGISTRÉES : </div>
                        {categoriesSelected.map((allCategoriesSelected) => {
                            const categoryDetails = JSON.parse(
                                allCategoriesSelected.category_details,
                            );
                            return (
                                <div
                                    key={allCategoriesSelected.category_id}
                                    value={allCategoriesSelected.category_id}
                                    className="categories_selected-list flex pr-4"
                                >
                                    <div className="categories_selected-list_icon pr-2">
                                        {Parser(categoryDetails.icon)}
                                    </div>
                                    <div className="categories_selected-list_label">
                                        {categoryDetails.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="opening-title text-2xl text-teal-700 font-bold pb-6">
                        HORRAIRES DE VOTRE ETABLISSMENT :
                    </div>
                    <FormOpening formik={formikOpening} />
                    <div className="pb-4 font-bold text-xl">
                        ETAPE 2 : modifier tous les champs puis envoyez votre demande de création.
                    </div>
                    <div className="establishment-infos-title text-2xl text-teal-700 font-bold pb-6">
                        INFORMATIONS DE VOTRE ETABLISSMENT :
                    </div>
                    <Loader allClass={'loading display'} />
                    {establishment.map((establishment) => (
                        <Formik
                            key={establishment.establishment_id}
                            initialValues={{
                                logo: establishment.logo || '',
                                trade_name: establishment.trade_name || '',
                                siret: establishment.siret || '',
                                address: establishment.address || '',
                                city: establishment.city || '',
                                postal_code: establishment.postal_code || '',
                                phone: establishment.phone || '',
                                email: establishment.email || '',
                                website: establishment.website || '',
                            }}
                            onSubmit={handleFormSubmit}
                            validationSchema={establishmentSchema}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <Box
                                        display="grid"
                                        gap="30px"
                                        gridTemplateColumns="repeat(4, minmax(0,1 fr))"
                                    >
                                        <Grid container spacing={2}>
                                            <FormFieldModel
                                                grid={12}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.logo}
                                                name={'logo'}
                                                //convert to boolean using !! operator
                                                error={!!touched.logo && !!errors.logo}
                                                helperText={touched.logo && errors.logo}
                                            />
                                            <FormFieldModel
                                                grid={6}
                                                label="Nom de l'etablissement"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.trade_name}
                                                name={'trade_name'}
                                                //convert to boolean using !! operator
                                                error={!!touched.trade_name && !!errors.trade_name}
                                                helperText={touched.trade_name && errors.trade_name}
                                            />
                                            <FormFieldModel
                                                grid={6}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.siret}
                                                name={'siret'}
                                                //convert to boolean using !! operator
                                                error={!!touched.siret && !!errors.siret}
                                                helperText={touched.siret && errors.siret}
                                            />
                                            <FormFieldModel
                                                grid={6}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.address}
                                                name={'address'}
                                                //convert to boolean using !! operator
                                                error={!!touched.address && !!errors.address}
                                                helperText={touched.address && errors.address}
                                            />
                                            <FormFieldModel
                                                grid={6}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.city}
                                                name={'city'}
                                                //convert to boolean using !! operator
                                                error={!!touched.city && !!errors.city}
                                                helperText={touched.city && errors.city}
                                            />
                                            <FormFieldModel
                                                grid={6}
                                                label="Code postal"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.postal_code}
                                                name={'postal_code'}
                                                //convert to boolean using !! operator
                                                error={
                                                    !!touched.postal_code && !!errors.postal_code
                                                }
                                                helperText={
                                                    touched.postal_code && errors.postal_code
                                                }
                                            />
                                            <FormFieldModel
                                                grid={6}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.phone}
                                                name={'phone'}
                                                //convert to boolean using !! operator
                                                error={!!touched.phone && !!errors.phone}
                                                helperText={touched.phone && errors.phone}
                                            />
                                            <FormFieldModel
                                                grid={6}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.email}
                                                name={'email'}
                                                //convert to boolean using !! operator
                                                error={!!touched.email && !!errors.email}
                                                helperText={touched.email && errors.email}
                                            />

                                            <FormFieldModel
                                                grid={6}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.website}
                                                name={'website'}
                                                //convert to boolean using !! operator
                                                error={!!touched.website && !!errors.website}
                                                helperText={touched.website && errors.website}
                                            />
                                        </Grid>
                                    </Box>
                                    <Box display="flex" justifyContent="end" mt="20px">
                                        <div className="w-fit inline-block text-white lg:text-xl">
                                            <button
                                                onClick={goBack}
                                                className="w-fit mr-2 bg-red-700 hover:border-solid hover:border-white-900 hover:border-2 pt-2 pb-2 pr-4 pl-4 rounded-lg"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                        <button
                                            type="submit"
                                            className=" sm:ml-4 mt-7 sm:mt-0 mb-7 sm:mb-0 bg-teal-700 text-white font-bold"
                                        >
                                            Sauvegarder
                                        </button>
                                    </Box>
                                </form>
                            )}
                        </Formik>
                    ))}
                </Box>
            </section>
        </Paper>
    );
}
