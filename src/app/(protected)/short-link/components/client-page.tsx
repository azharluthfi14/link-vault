'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  deleteShortLinkAction,
  updateShortLinkAction,
} from '@/features/short-links/actions/short-link.action';
import { useResettableActionState } from '@/hooks';

import { useShortLinkDetail, useShortLinks } from '../hooks';
import { ConfirmDeleteLink } from './confirm-delete';
import { DetailLink } from './detail-link';
import { EditLinkModal } from './edit-link';
import { TableLink } from './table-link';

export const ShortLinkCLientPage = () => {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState('');
  const { data: shortLink, isLoading: loadingShortLink } = useShortLinks();
  const { data: detailShortLink } = useShortLinkDetail(selectedId ?? undefined);

  const [modalDetail, setModalDetail] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const openDetailModal = (id: string) => {
    setSelectedId(id);
    setModalDetail(true);
  };

  const openEditModal = () => {
    setModalEdit(true);
    setModalDetail(false);
  };

  const openDeleteModal = () => {
    setModalDelete(true);
    setModalDetail(false);
  };

  const [, formDeleteShortLink] = useResettableActionState(
    deleteShortLinkAction,
    null,
    {
      onSuccess: (result) => {
        toast.success(result?.message);
        setModalDelete(false);
        queryClient.invalidateQueries({ queryKey: ['short-links'] });
      },
      onError: (result) => {
        if (!result?.success) {
          toast.error(result?.message || 'Server error');
          setModalDelete(false);
        }
      },
    }
  );

  const [stateEdit, formEditShortLink, editPending, resetEdit] =
    useResettableActionState(updateShortLinkAction, null, {
      onSuccess: (result) => {
        if (result?.success) {
          toast.success(result.message);
          setModalEdit(false);
          resetEdit();
          queryClient.invalidateQueries({
            queryKey: ['short-link', selectedId],
          });
          queryClient.invalidateQueries({
            queryKey: ['short-links'],
          });
        }
      },
      onError: (result) => {
        if (!result?.success && result?.code !== 'VALIDATION_ERROR') {
          toast.error(result?.message);
        }
      },
    });

  return (
    <>
      <TableLink
        handleClickDetail={openDetailModal}
        shortLink={shortLink?.items}
        isLoading={loadingShortLink}
      />
      <DetailLink
        openEditModal={openEditModal}
        deleteAction={formDeleteShortLink}
        shortLink={detailShortLink!}
        isOpen={modalDetail}
        openDeleteModal={openDeleteModal}
        onOpenChange={() => {
          setModalDetail(false);
        }}
      />
      <ConfirmDeleteLink
        openDeleteModal={modalDelete}
        formActionDeleteLink={formDeleteShortLink}
        selectedLinkId={selectedId}
        onOpenChange={() => {
          setModalDelete(false);
        }}
      />
      <EditLinkModal
        openModalEdit={modalEdit}
        action={formEditShortLink}
        isLoading={editPending}
        shortLink={detailShortLink ?? null}
        errors={
          stateEdit?.success === false && stateEdit.code === 'VALIDATION_ERROR'
            ? stateEdit.fieldErrors
            : undefined
        }
        onOpenChange={() => {
          setModalEdit(false);
        }}
      />
    </>
  );
};
