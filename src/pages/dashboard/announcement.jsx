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

export function Announcements() {
    const allAnnouncementsString = localStorage.getItem('all_announcements');
    const announcements = JSON.parse(allAnnouncementsString);
    return (<div className="mt-12 mb-8 flex flex-col gap-12">
    <Card>
    <CardHeader  color="gray" className="mb-8 p-6 bg-[#145182]">
            <Typography variant="h6" color="white">
                Announcements
                </Typography>
                
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
                <thead>
                    <tr>
                        {["Index","Title","Description", "Created On"].map(
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
                    {announcements && announcements.map(
                        ({ _id, title, description, createdAt }, key) => {
                            const className = `py-3 px-5 ${key === announcements.length - 1
                                    ? ""
                                    : "border-b border-blue-gray-50"
                                }`;

                            return (
                                <tr key={_id + Math.random()}>
                                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600 capitalize">
                        {key + 1}
                      </Typography>
                      
                    </td>
                                    <td className={className}>
                                        <div className="flex items-center gap-4">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-bold"
                                            >
                                                {title}
                                            </Typography>
                                        </div>
                                    </td>
                                   
                                    <td className={className}>
                                        <Typography
                                            variant="small"
                                            className="text-xs font-medium text-blue-gray-600"
                                        >
                                            {description}
                                        </Typography>
                                    </td>
                                   
                                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        { moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                        
                      </Typography>
                                    </td>
                                
                                </tr>
                            );
                        }
                    )}
                </tbody>
            </table>
        </CardBody>
    </Card>
</div>);
   }
   
   export default Announcements;