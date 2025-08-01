import { useApolloClient } from "@apollo/client";
import { ERRORS } from "@hey/data/errors";
import getAccount from "@hey/helpers/getAccount";
import { useMuteMutation, useUnmuteMutation } from "@hey/indexer";
import type { ApolloClientError } from "@hey/types/errors";
import { useState } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/Shared/UI";
import errorToast from "@/helpers/errorToast";
import { useMuteAlertStore } from "@/store/non-persisted/alert/useMuteAlertStore";
import { useAccountStore } from "@/store/persisted/useAccountStore";

const MuteOrUnmuteAccount = () => {
  const { currentAccount } = useAccountStore();
  const {
    mutingOrUnmutingAccount,
    setShowMuteOrUnmuteAlert,
    showMuteOrUnmuteAlert
  } = useMuteAlertStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasMuted, setHasMuted] = useState(
    mutingOrUnmutingAccount?.operations?.isMutedByMe
  );
  const { cache } = useApolloClient();

  const updateCache = () => {
    if (!mutingOrUnmutingAccount?.operations) {
      return;
    }

    cache.modify({
      fields: { isMutedByMe: () => !hasMuted },
      id: cache.identify(mutingOrUnmutingAccount?.operations)
    });
  };

  const onCompleted = () => {
    updateCache();
    setIsSubmitting(false);
    setHasMuted(!hasMuted);
    setShowMuteOrUnmuteAlert(false);
    toast.success(hasMuted ? "Unmuted successfully" : "Muted successfully");
  };

  const onError = (error: ApolloClientError) => {
    setIsSubmitting(false);
    errorToast(error);
  };

  const [mute] = useMuteMutation({
    onCompleted,
    onError
  });

  const [unmute] = useUnmuteMutation({
    onCompleted,
    onError
  });

  const muteOrUnmute = async () => {
    if (!currentAccount) {
      return toast.error(ERRORS.SignWallet);
    }

    setIsSubmitting(true);

    // Unmute
    if (hasMuted) {
      return await unmute({
        variables: {
          request: { account: mutingOrUnmutingAccount?.address }
        }
      });
    }

    // Mute
    return await mute({
      variables: {
        request: { account: mutingOrUnmutingAccount?.address }
      }
    });
  };

  return (
    <Alert
      confirmText={hasMuted ? "Unmute" : "Mute"}
      description={`Are you sure you want to ${
        hasMuted ? "unmute" : "mute"
      } ${getAccount(mutingOrUnmutingAccount).usernameWithPrefix}?`}
      isPerformingAction={isSubmitting}
      onClose={() => setShowMuteOrUnmuteAlert(false)}
      onConfirm={muteOrUnmute}
      show={showMuteOrUnmuteAlert}
      title="Mute Account"
    />
  );
};

export default MuteOrUnmuteAccount;
