"use client";

import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { useGetAuditLogsQuery } from "@/redux/api/auditApi";
import { setPage } from "@/redux/paginationSlice";
import { RootState } from "@/redux/store";
import { AuditLog } from "@/types/audit";

import Pagination from "@/components/shared/Pagination";
import AuditLogDetailsModal from "./AuditLogDetailsModal";
import DataTable from "@/components/shared/DataTable";
import { getAuditLogColumns } from "./auditLogsTableColumns";

export default function AuditLogs() {
  const dispatch = useAppDispatch();
  const { page, size } = useAppSelector((state: RootState) => state.pagination);

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const { data, isLoading } = useGetAuditLogsQuery({
    page,
    limit: size,
  });

  const logs: AuditLog[] = useMemo(() => data?.data || [], [data]);
  const meta = data?.meta;

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setOpenModal(true);
  };

  const columns = useMemo(
    () => getAuditLogColumns({ onView: handleViewDetails }),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Audit Logs</h2>
          <p className="text-sm text-muted-foreground">
            Track all system activities
          </p>
        </div>
        <span className="text-sm text-muted-foreground">
          {meta?.total || 0} logs
        </span>
      </div>

      <div className="border rounded-xl bg-card shadow-sm p-4">
        <DataTable columns={columns} data={logs} loading={isLoading} />
      </div>

      {meta && (
        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          onPageChange={(newPage) => dispatch(setPage(newPage))}
        />
      )}

      <AuditLogDetailsModal
        open={openModal}
        onOpenChange={setOpenModal}
        log={selectedLog}
      />
    </div>
  );
}
