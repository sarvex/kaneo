import useInviteWorkspaceUser from '@/hooks/mutations/workspace-user/use-invite-workspace-user';
import useGetWorkspaces from '@/hooks/queries/workspace/use-get-workspaces';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { Building2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Select } from '../ui/select';

type Props = {
  readonly open: boolean;
  readonly onClose: () => void;
};

const teamMemberSchema = z.object({
  userEmail: z.string().email(),
  workspaceId: z.string(),
});

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

const InviteTeamMemberModal = ({ open, onClose }: Props) => {
  const { data: workspaces } = useGetWorkspaces();
  const { mutateAsync } = useInviteWorkspaceUser();

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      userEmail: '',
      workspaceId: '',
    },
  });

  const onSubmit = async ({ userEmail, workspaceId }: TeamMemberFormValues) => {
    await mutateAsync({ userEmail, workspaceId });

    form.reset();
    onClose();
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onClose}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <Dialog.Title className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Invite Team Member
              </Dialog.Title>
              <Dialog.Close className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300">
                <X size={20} />
              </Dialog.Close>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="p-4"
              >
                <div className="space-y-4">
                  <div>
                    <FormField
                      control={form.control}
                      name="userEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-1">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="colleague@company.com"
                              className="bg-white dark:bg-zinc-800/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="workspaceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-1">
                          Workspace
                        </FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            options={[
                              {
                                value: '',
                                label: 'Select a workspace',
                                icon: (
                                  <Building2 className="w-4 h-4 text-zinc-400" />
                                ),
                              },
                              ...(workspaces ?? []).map((workspace) => ({
                                value: workspace.id,
                                label: workspace.name,
                              })),
                            ]}
                            placeholder="Select workspace"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Dialog.Close asChild>
                    <Button
                      type="button"
                      className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                    >
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <Button
                    type="submit"
                    className="bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                  >
                    Send Invitation
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default InviteTeamMemberModal;
