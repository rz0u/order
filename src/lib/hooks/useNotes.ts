import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotes, createNote, deleteNote, updateNotePosition, updateNoteColor } from '../actions/notes.actions'

export function useNotes() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
  })

  const addNoteMutation = useMutation({
    mutationFn: (content: string) => createNote(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const updateNotePositionMutation = useMutation({
    mutationFn: ({ id, x, y }: { id: string, x: number, y: number }) => updateNotePosition(id, x, y),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const updateNoteColorMutation = useMutation({
    mutationFn: ({ id, color }: { id: string, color: string }) => updateNoteColor(id, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  return {
    notes: query.data ?? [],
    isLoading: query.isLoading,
    addNote: addNoteMutation.mutate,
    updatePosition: updateNotePositionMutation.mutate,
    updateColor: updateNoteColorMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
  }
}
