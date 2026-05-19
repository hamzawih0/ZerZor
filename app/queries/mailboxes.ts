import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "~/services/api";
import { queryKeys } from "~/queries/keys";

type Mailbox = {
	id: string;
	email: string;
	name: string;
};

type MailboxResponse = {
	emails?: Array<{
		id: string;
		address: string;
	}>;
};

async function fetchMailboxes(): Promise<Mailbox[]> {
	const response = await fetch("/api/emails", { credentials: "include" });
	if (!response.ok) {
		const errorBody = await response.json().catch(() => null) as { error?: string } | null;
		throw new Error(errorBody?.error || `Request failed with status ${response.status}`);
	}

	const data = await response.json() as MailboxResponse;
	return (data.emails ?? []).map((email) => ({
		id: email.id,
		email: email.address,
		name: email.address.split("@")[0] || email.address,
	}));
}

export function useMailboxes() {
	return useQuery({
		queryKey: queryKeys.mailboxes.all,
		queryFn: fetchMailboxes,
	});
}

export function useCreateMailbox() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ email, name }: { email: string; name: string }) => api.createMailbox(email, name),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: queryKeys.mailboxes.all });
			await queryClient.invalidateQueries({ queryKey: queryKeys.config });
		},
	});
}

export function useDeleteMailbox() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (mailboxId: string) => {
			const response = await fetch(`/api/emails/${mailboxId}`, {
				method: "DELETE",
				credentials: "include",
			});

			if (!response.ok) {
				const errorBody = await response.json().catch(() => null) as { error?: string } | null;
				throw new Error(errorBody?.error || `Request failed with status ${response.status}`);
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: queryKeys.mailboxes.all });
		},
	});
}
