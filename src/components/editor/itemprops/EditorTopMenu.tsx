import React, { useEffect, useState } from 'react'
import { useBoolean } from '@fluentui/react-hooks'
import {
  CommandBar,
  PrimaryButton,
  DefaultButton,
  TextField,
  Dialog,
  DialogType,
  DialogFooter,
  ICommandBarItemProps,
  IDialogContentProps,
  IModalProps
} from '@fluentui/react'
import { useDispatch, useSelector } from "react-redux";
import { createNewSection, selectLambnoteId } from "../../../store/NoteSlice";

export const EditorTopMenu: React.FC = () => {
  const dispatch = useDispatch()
  const [sectionName, setSectionName] = useState('')
  const lambnoteId = useSelector(selectLambnoteId)

  const [
    hideNewSectionDialog,
    { toggle: toggleHideNewSectionDialog }
  ] = useBoolean(true)
  const [hideNewPageDialog, { toggle: toggleHideNewPageDialog }] = useBoolean(
    true
  )

  const _items: ICommandBarItemProps[] = [
    {
      key: 'newItem',
      text: 'New',
      iconProps: { iconName: 'Add' },
      subMenuProps: {
        items: [
          {
            key: 'section',
            text: 'New Section',
            iconProps: { iconName: 'AddToShoppingList' },
            onClick: toggleHideNewSectionDialog
          },
          {
            key: 'page',
            text: 'New Page',
            iconProps: { iconName: 'AddNotes' },
            onClick: toggleHideNewPageDialog
          }
        ]
      }
    },
    {
      key: 'save',
      text: 'Save',
      iconProps: { iconName: 'SaveAs' }
    }
  ]

  const newSectionDialogProps: IDialogContentProps = {
    type: DialogType.normal,
    title: 'Create new section',
    subText: 'Please enter the section name'
  }

  const newPageDialogProps: IDialogContentProps = {
    type: DialogType.normal,
    title: 'Create new page',
    subText: 'Please enter the page name'
  }

  const modalProps: IModalProps = {
    isBlocking: true
  }

  const handleCreateSection = () => {
    toggleHideNewSectionDialog()
    dispatch(createNewSection(lambnoteId, sectionName))
  }

  const handleChange = (e: any, value: string | undefined) => {
    value ? setSectionName(value) : setSectionName('')
  }

  return (
    <>
      <CommandBar items={_items} />
      <Dialog
        hidden={hideNewSectionDialog}
        onDismiss={toggleHideNewSectionDialog}
        dialogContentProps={newSectionDialogProps}
        modalProps={modalProps}
      >
        <TextField onChange={handleChange} />
        <DialogFooter>
          <PrimaryButton onClick={handleCreateSection} text="Create" />
          <DefaultButton onClick={toggleHideNewSectionDialog} text="Cancel" />
        </DialogFooter>
      </Dialog>
      <Dialog
        hidden={hideNewPageDialog}
        onDismiss={toggleHideNewPageDialog}
        dialogContentProps={newPageDialogProps}
        modalProps={modalProps}
      />
    </>
  )
}
