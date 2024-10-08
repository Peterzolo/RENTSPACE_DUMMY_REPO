import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Chip,
    Tooltip,
    Progress,
  } from "@material-tailwind/react";
  import moment from 'moment';
  import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
  import {  projectsTableData } from "@/data";

export function SessionHistory() {
    const allAdminHistoriesString = localStorage.getItem('all_histories');
    const historiesData = JSON.parse(allAdminHistoriesString);
    const historiesError = localStorage.getItem('histories_permission_error');
    const permissionError = JSON.parse(historiesError);
    const userDataString = localStorage.getItem('user_info');
    const userData = JSON.parse(userDataString);
    
    return (<div className="mt-12 mb-8 flex flex-col gap-12">
    {userData.role != 'super-admin'  ? <div className="flex items-center justify-normal mx-auto h-[50vh]">Oops!!! You do not have permission to view this Page.</div> : <Card>
    <CardHeader  color="gray" className="mb-8 p-6 bg-[#145182]">
            <Typography variant="h6" color="white">
                Admin Histories
            </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
                <thead>
                    <tr>
                        {["Index","User ID","Email","Role", "Time"].map(
                            (el) => (
                                <th
                                    key={el}
                                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                >
                                    <Typography
                                        variant="small"
                                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                                    >
                                        {el}
                                    </Typography>
                                </th>
                            )
                        )}
                    </tr>
                </thead>
                <tbody>
                    {historiesData.map(
                        ({...data }, key) => {
                            const className = `py-3 px-5 ${key === historiesData.length - 1
                                    ? ""
                                    : "border-b border-blue-gray-50"
                                }`;

                            return (
                                <tr key={data.id + Math.random()}>
                                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600 capitalize">
                        {key + 1}
                      </Typography>
                      
                    </td>
                                    <td className={className}>
                                        <div className="flex items-center gap-4">
                                            {/* <Avatar src={img} alt={name} size="sm" /> */}
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-bold"
                                            >
                                                {data.user?.firstName}{data.user?.lastName}
                                            </Typography>
                                        </div>
                                    </td>
                                    {/* <td className={className}>
                                        {members.map(({ img, name }, key) => (
                                            <Tooltip key={name} content={name}>
                                                <Avatar
                                                    src={walletId}
                                                    alt={name}
                                                    size="xs"
                                                    variant="circular"
                                                    className={`cursor-pointer border-2 border-white ${key === 0 ? "" : "-ml-2.5"
                                                        }`}
                                                />
                                            </Tooltip>
                                        ))}
                                    </td> */}
                                    <td className={className}>
                                        <Typography
                                            variant="small"
                                            className="text-xs font-medium text-blue-gray-600"
                                        >
                                            {data.email}
                                        </Typography>
                                    </td>
                                    <td className={className}>
                      <Chip
                        variant="gradient"
                        color={data.action == 'login' ? "green" : "red"}
                        value={data.action == 'login' ? "LOGIN" : "LOGOUT"}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                      />
                    </td>
                                    {/* <td className={className}>
                                        <Typography
                                            variant="small"
                                            className="text-xs font-medium text-blue-gray-600"
                                        >
                                            {data.action}
                                        </Typography>
                                    </td> */}
                                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        { moment(data.in|| data.out).format('MMMM Do YYYY, h:mm:ss a')}
                        
                      </Typography>
                                    </td>
                                    {/* <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        { moment(data.out).format('MMMM Do YYYY, h:mm:ss a')}
                        
                      </Typography>
                    </td> */}
                                    {/* <td className={className}>
                                        <div className="w-10/12">
                                            <Typography
                                                variant="small"
                                                className="mb-1 block text-xs font-medium text-blue-gray-600"
                                            >
                                                {completion}%
                                            </Typography>
                                            <Progress
                                                value={completion}
                                                variant="gradient"
                                                color={completion === 100 ? "green" : "gray"}
                                                className="h-1"
                                            />
                                        </div>
                                    </td> */}
                                    {/* <td className={className}>
                                        <Typography
                                            as="a"
                                            href="#"
                                            className="text-xs font-semibold text-blue-gray-600"
                                        >
                                            <EllipsisVerticalIcon
                                                strokeWidth={2}
                                                className="h-5 w-5 text-inherit"
                                            />
                                        </Typography>
                                    </td> */}
                                    {/* <td className={className}>
                                        <Typography
                                            as="a"
                                            href="#"
                                            className="text-xs font-semibold text-blue-gray-600"
                                        >
                                            <EllipsisVerticalIcon
                                                strokeWidth={2}
                                                className="h-5 w-5 text-inherit"
                                            />
                                        </Typography>
                                    </td> */}
                                  
                                
                                </tr>
                            );
                        }
                    )}
                </tbody>
            </table>
        </CardBody>
    </Card>}
</div>);
}

export default SessionHistory;