import { BasicPage } from '../../Components/CommonComponents/BasicPage';
import BusinessIcon from '@mui/icons-material/Business';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import { ButtonLink } from '../../Components/CommonComponents/ButtonLink';
import { ButtonDelete } from '../../Components/CommonComponents/ButtonDelete';
import '../../css/Professional/Establishment.css';
import Axios from '../../utils/axiosUrl';
import { useEffect, useState } from 'react';
import { useAuth } from '../../Components/Hooks/useAuth';
import { Loader } from '../../Components/CommonComponents/Loader';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';

export default function EstablishmentPage() {
    const { user } = useAuth();
    const token = user.token;
    const ownerId = user.userLogged.owner_id;

    //dataGRID
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        setColumns([
            {
                field: 'status',
                headerName: 'Status',
                width: 130,
                renderCell: (params) =>
                    params.row.status_id === 4 ? (
                        <div className="bg-lime-500 w-full h-full flex justify-start items-center text-white p-0">
                            <CheckCircleIcon sx={{ marginX: 1 }} />
                            <span className="pl-2">Valider</span>
                        </div>
                    ) : params.row.status_id === 5 ? (
                        <div className="bg-red-700 w-full h-full flex justify-start items-center text-white p-0">
                            <CancelIcon sx={{ marginX: 1 }} />
                            <span className="pl-2">Refuser</span>
                        </div>
                    ) : params.row.status_id === 6 ? (
                        <div className="bg-amber-500 w-full h-full flex justify-start items-center text-white p-0">
                            <PendingIcon sx={{ marginX: 1 }} />
                            <span className="pl-2">En attente</span>
                        </div>
                    ) : (
                        <div>Erreur</div>
                    ),
            },
            {
                field: 'logo',
                headerName: 'Logo',
                width: 100,
                renderCell: (params) => <img src={params.value} />,
            },
            {
                field: 'trade_name',
                headerName: 'Nom commercial',
                width: 200,
            },
            {
                field: 'address',
                headerName: 'Adresse',
                width: 200,
            },
            {
                field: 'postal_code',
                headerName: 'Code postal',
                width: 150,
            },
            {
                field: 'website',
                headerName: 'Site web',
                width: 200,
            },
            {
                field: 'phone',
                headerName: 'Téléphone',
                width: 150,
            },
            {
                field: 'Modifier',
                headerName: 'Modifier',
                width: 150,
                renderCell: (params) =>
                    params.row.status_id === 4 ? (
                        <ButtonLink
                            link={`/pro/establishmentForm/${params.row.establishment_id}`}
                            allClass="text-center flex align-center justify-center flex-wrap w-full h-full text-white bg-lime-500"
                            text="Modifier"
                            icon={<EditIcon />}
                        />
                    ) : params.row.status_id === 5 ? (
                        <div className="bg-red-700 w-full h-full flex justify-start items-center text-white">
                            <span className="pl-2">Refuser</span>
                        </div>
                    ) : params.row.status_id === 6 ? (
                        <div className="bg-amber-500 w-full h-full flex justify-start items-center text-white">
                            <span className="pl-2">En attente</span>
                        </div>
                    ) : (
                        <div className=""> Pas de données</div>
                    ),
            },
            {
                field: 'delete',
                headerName: 'Supprimer',
                width: 150,
                renderCell: (params) =>
                    params.row.status_id === 4 ? (
                        <ButtonDelete
                            functionDelete={() => deleteEstablishment(params.row.establishment_id)}
                            allClass="text-white bg-red-700 w-full h-full rounded-none"
                        />
                    ) : params.row.status_id === 5 ? (
                        <div className="bg-red-700 w-full h-full flex justify-start items-center text-white">
                            Refuser
                        </div>
                    ) : params.row.status_id === 6 ? (
                        <div className="bg-amber-500 w-full h-full flex justify-start items-center text-white">
                            <span className="pl-2">En attente</span>
                        </div>
                    ) : (
                        <div className=""> Pas de données</div>
                    ),
            },
        ]);
    }, [rows]);

    async function getEstablishments() {
        try {
            const response = await Axios.api.get(`/pro/${ownerId}/establishment`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setRows(response.data.data);
            await new Promise((resolve) => setTimeout(resolve)); // Attendre un tick pour laisser le temps à React de mettre à jour l'interface utilisateur
            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.remove('display');
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getEstablishments();
    }, []);

    const deleteEstablishment = (id) => {
        Axios.api
            .delete(`/pro/${ownerId}/establishment/${id}/delete`, {
                headers: {
                    accept: 'application/vnd.api+json',
                    'Content-Type': 'application/vnd.api+json',
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                console.log('bien effacé');
                getEstablishments();
            })
            .catch((error) => {
                console.log(error);
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
            <BasicPage title="Tous mes etablissements" icon={<BusinessIcon />} />
            <Loader allClass={'loading display pt-20 pb-20'} />
            <DataGrid
                getRowId={(rows) => rows.establishment_id}
                rows={rows}
                columns={columns}
                components={{
                    Toolbar: GridToolbar,
                }}
                autoHeight
                disableSelectionOnClick
                disableColumnFilter={false}
                onFilterModelChange={(model) => console.log(model)}
                pageSize={10}
                rowsPerPageOptions={[10, 20, 50]}
                sx={{ marginY: 6, marginX: 2 }}
            />
            <div className="flex justify-center pb-4">
                <button className="custom-button-teal">
                    <a href={`/pro/${ownerId}/establishment/create`}>Ajouter un etablissement</a>
                </button>
            </div>
        </Paper>
    );
}
