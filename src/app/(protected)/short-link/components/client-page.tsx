'use client';

import { useQueryClient } from '@tanstack/react-query';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useShortLinkDetail, useShortLinks } from '@/features/short-links';
import {
  deleteShortLinkAction,
  updateShortLinkAction,
} from '@/features/short-links/actions/short-link.action';
import { useDebounce, useResettableActionState } from '@/hooks';

import { ConfirmDeleteLink } from './confirm-delete';
import { DetailLink } from './detail-link';
import { EditLinkModal } from './edit-link';
import { TableLink } from './table-link';

const LIMIT = 5;

export const ShortLinkCLientPage = () => {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState('');

  const [query, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    search: parseAsString.withDefault(''),
    status: parseAsString,
  });

  const searchDebounce = useDebounce(query.search, 400);

  const { data: shortLink, isLoading: loadingShortLink } = useShortLinks({
    page: query.page,
    limit: LIMIT,
    search: searchDebounce,
  });
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

  useEffect(() => {
    if (!shortLink?.meta.totalPages) return;

    queryClient.prefetchQuery({
      queryKey: ['short-links', { page: query.page + 1, LIMIT }],
    });
  }, [shortLink?.meta.totalPages, queryClient, query.page]);

  useEffect(() => {
    setQuery({
      search: searchDebounce || undefined,
      page: 1,
    });
  }, [searchDebounce]);

  return (
    <>
      <TableLink
        handleClickDetail={openDetailModal}
        shortLink={shortLink?.items}
        onPageChange={(page) => setQuery({ page })}
        isLoading={loadingShortLink}
        totalPages={shortLink?.meta?.totalPages ?? 0}
        page={query.page}
        keyword={query.search}
        setKeyword={(search: string) => setQuery({ search, page: 1 })}
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
