'use client';

import { useQueryClient } from '@tanstack/react-query';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { ComputedStatus } from '@/features/short-links';
import { useShortLinkDetail, useShortLinks } from '@/features/short-links';
import {
  deleteShortLinkAction,
  disabledShortLink,
  updateShortLinkAction,
} from '@/features/short-links/actions/short-link.action';
import { useDebounce, useResettableActionState } from '@/hooks';

import { ConfirmDeleteLink } from './confirm-delete';
import { DetailLink } from './detail-link';
import { EditLinkModal } from './edit-link';
import { TableLink } from './table-link';

const LIMIT = 6;

export const ShortLinkCLientPage = () => {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState('');

  const [query, setQuery] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
    search: parseAsString.withDefault(''),
    status: parseAsString.withDefault('all'),
  });

  const searchDebounce = useDebounce(query.search, 400);

  const { data: shortLink, isLoading: loadingShortLink } = useShortLinks({
    page: query.page,
    limit: LIMIT,
    search: searchDebounce,
    status:
      query.status === 'all' ? undefined : (query.status as ComputedStatus),
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
        if (result?.success) {
          toast.success('Short link deleted');
          setModalDelete(false);
          queryClient.invalidateQueries({ queryKey: ['short-links'] });
        }
      },
      onError: (result) => {
        if (!result?.success && result?.showToast) {
          toast.error(result?.error || 'Server error');
          setModalDelete(false);
        }
      },
    }
  );

  const [stateEdit, formEditShortLink, editPending, resetEdit] =
    useResettableActionState(updateShortLinkAction, null, {
      onSuccess: (result) => {
        if (result?.success) {
          toast.success('Short link updated');
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
        if (!result?.success && result?.showToast) {
          toast.error(result.error);
        }
      },
    });

  const [, formDisableShortLink] = useResettableActionState(
    disabledShortLink,
    null,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['short-link', selectedId] });
        queryClient.invalidateQueries({
          queryKey: ['short-links'],
        });
      },
    }
  );

  const [, formEnableShortLink] = useResettableActionState(
    disabledShortLink,
    null,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['short-link', selectedId] });
        queryClient.invalidateQueries({
          queryKey: ['short-links'],
        });
      },
    }
  );

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
  }, [searchDebounce, setQuery]);

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
        status={query.status}
        onStatusChange={(status) => {
          setQuery({ status, page: 1 });
        }}
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
        enableAction={formEnableShortLink}
        disableAction={formDisableShortLink}
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
          !stateEdit?.success && !stateEdit?.showToast
            ? stateEdit?.fieldErrors
            : undefined
        }
        onOpenChange={() => {
          setModalEdit(false);
        }}
      />
    </>
  );
};
