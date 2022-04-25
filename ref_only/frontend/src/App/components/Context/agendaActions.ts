
const AGENDA_ITEM_CREATED = 'AGENDA_ITEM_CREATED'
type AgendaItemCreated = {
    type: typeof AGENDA_ITEM_CREATED
    data: {
        id: string
    }
}


const AGENDA_ITEM_DELETED = 'AGENDA_ITEM_DELETED'
type AgendaItemDeleted = {
    type: typeof AGENDA_ITEM_DELETED
    data: {
        id: string
    }
}

type AgendaAction =
    | AgendaItemCreated
    | AgendaItemDeleted

export {
    AgendaAction,
    AGENDA_ITEM_CREATED,
    AGENDA_ITEM_DELETED
}