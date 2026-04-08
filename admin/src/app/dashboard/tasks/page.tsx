"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { useGetUsersQuery } from "@/redux/api/usersApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { useDeleteTaskMutation, useGetTasksQuery } from "@/redux/api/taskApi";
import DataTable from "@/app/common/DataTable";
import Pagination from "@/app/common/Pagination";
import { setPage } from "@/redux/paginationSlice";

export default function AllTasksPage() {
  const dispatch = useAppDispatch();
  const { page, size } = useAppSelector((state) => state.pagination);

  const { data, isLoading } = useGetTasksQuery({
    page,
    limit: size,
  });
  console.log("data", data);
  const { data: users = [] } = useGetUsersQuery();
  const [deleteTask] = useDeleteTaskMutation();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const tasks = data?.data || [];
  const meta = data?.meta;

  const handleDelete = async () => {
    if (deletingId) {
      await deleteTask(deletingId);
      setDeletingId(null);
    }
  };

  const columns = [
    { title: "Title", key: "title" },
    { title: "Status", key: "status" },
    { title: "Assignee", key: "assigneeId" },
    {
      title: "Actions",
      key: "actions",
      render: (row: any) => (
        <button onClick={() => setDeletingId(row.id)}>
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">All Tasks</h2>

      <DataTable columns={columns} data={tasks} loading={isLoading} />

      {meta && (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          onPageChange={(p) => dispatch(setPage(p))}
        />
      )}

      {deletingId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded">
            <p>Are you sure?</p>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
