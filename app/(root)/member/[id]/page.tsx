import { updateMember } from "@/lib/actions/member.actions";
import { fetchMember } from "@/lib/actions/member.actions";
import UpdateMember from "@/components/forms/UpdateMember";

interface MemberPageParams {
    params: {
      id: string;
    };
  }
  
  const MemberPage = async ({ params }: MemberPageParams) => {
    const { id } = params;
    const member = await fetchMember(id);

  if (!member) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="head-text">Update Member</h1>
      <UpdateMember memberId={member._id} initialData={member} />
    </>
  );
};

export default MemberPage;
