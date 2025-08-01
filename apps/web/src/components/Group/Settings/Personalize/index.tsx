import { useGroupQuery } from "@hey/indexer";
import { useParams } from "react-router";
import Custom404 from "@/components/Shared/404";
import Custom500 from "@/components/Shared/500";
import NotLoggedIn from "@/components/Shared/NotLoggedIn";
import PageLayout from "@/components/Shared/PageLayout";
import { useAccountStore } from "@/store/persisted/useAccountStore";
import GroupSettingsForm from "./Form";

const PersonalizeSettings = () => {
  const { address } = useParams<{ address: string }>();
  const { currentAccount } = useAccountStore();

  const { data, loading, error } = useGroupQuery({
    skip: !address,
    variables: { request: { group: address } }
  });

  if (!address || loading) {
    return null;
  }

  if (error) {
    return <Custom500 />;
  }

  const group = data?.group;

  if (!group || currentAccount?.address !== group.owner) {
    return <Custom404 />;
  }

  if (!currentAccount) {
    return <NotLoggedIn />;
  }

  return (
    <PageLayout title="Group settings">
      <GroupSettingsForm group={group} />
    </PageLayout>
  );
};

export default PersonalizeSettings;
