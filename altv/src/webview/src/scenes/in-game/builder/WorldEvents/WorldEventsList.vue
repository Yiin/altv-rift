<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { ArrowDown, ArrowUpDown, ArrowUp, CalendarPlus } from "lucide-vue-next";
import { h, ref } from "vue";
import { WorldEventType } from "@shared/enums/world-event-type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { valueUpdater } from "@/lib/utils";
import DropdownAction from "./WorldEventRowAction.vue";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/vue-table";

export interface WorldEvent {
  id: string;
  type: WorldEventType;
  name: string;
}

const emit = defineEmits<{
  (e: "edit", id: string): void;
  (e: "delete", id: string): void;
  (e: "focus", id: string): void;
  (e: "create"): void;
}>();

const data: WorldEvent[] = [
  {
    id: "m5gr84i9",
    type: WorldEventType.CAMP,
    name: "Cayo Main Dock Thugs",
  },
  {
    id: "3u1reuv4",
    type: WorldEventType.CAMP,
    name: "Some thugs in the city",
  },
  {
    id: "derv1ws0",
    type: WorldEventType.EASY_BOSS,
    name: "Easy boss",
  },
  {
    id: "5kma53ae",
    type: WorldEventType.HARD_BOSS,
    name: "Hard boss",
  },
  {
    id: "bhqecj4p",
    type: WorldEventType.EXTREME_BOSS,
    name: "Special boss event",
  },
  {
    id: "zm5gr84i9",
    type: WorldEventType.CAMP,
    name: "Cayo Main Dock Thugs",
  },
  {
    id: "z3u1reuv4",
    type: WorldEventType.CAMP,
    name: "Some thugs in the city",
  },
  {
    id: "zderv1ws0",
    type: WorldEventType.EASY_BOSS,
    name: "Easy boss",
  },
  {
    id: "z5kma53ae",
    type: WorldEventType.HARD_BOSS,
    name: "Hard boss",
  },
  {
    id: "zbhqecj4p",
    type: WorldEventType.EXTREME_BOSS,
    name: "Special boss event",
  },
  {
    id: "xm5gr84i9",
    type: WorldEventType.CAMP,
    name: "Cayo Main Dock Thugs",
  },
  {
    id: "x3u1reuv4",
    type: WorldEventType.CAMP,
    name: "Some thugs in the city",
  },
  {
    id: "xderv1ws0",
    type: WorldEventType.EASY_BOSS,
    name: "Easy boss",
  },
  {
    id: "x5kma53ae",
    type: WorldEventType.HARD_BOSS,
    name: "Hard boss",
  },
  {
    id: "xbhqecj4p",
    type: WorldEventType.EXTREME_BOSS,
    name: "Special boss event",
  },
];

const columns: ColumnDef<WorldEvent>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () =>
            column.toggleSorting(
              column.getIsSorted() === "asc"
                ? true
                : column.getIsSorted() === "desc"
                  ? undefined
                  : false,
              true,
            ),
        },
        () => [
          "Type",
          h(
            column.getIsSorted() === "asc"
              ? ArrowDown
              : column.getIsSorted() === "desc"
                ? ArrowUp
                : ArrowUpDown,
            { class: "ml-2 h-4 w-4" },
          ),
        ],
      );
    },
    cell: ({ row }) => h("div", { class: "capitalize" }, row.getValue("type")),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () =>
            column.toggleSorting(
              column.getIsSorted() === "asc"
                ? true
                : column.getIsSorted() === "desc"
                  ? undefined
                  : false,
              true,
            ),
        },
        () => [
          "Name",
          h(
            column.getIsSorted() === "asc"
              ? ArrowDown
              : column.getIsSorted() === "desc"
                ? ArrowUp
                : ArrowUpDown,
            { class: "ml-2 h-4 w-4" },
          ),
        ],
      );
    },
    cell: ({ row }) => h("div", {}, row.getValue("name")),
  },
  {
    id: "focus",
    cell: ({ row }) => {
      return h(
        Button,
        {
          size: "xs",
          onClick: () => {
            emit("focus", row.original.id);
          },
        },
        "Focus",
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const worldEvent = row.original;

      return h(
        "div",
        { class: "relative" },
        h(DropdownAction, {
          worldEvent,
          onEdit: (worldEventId) => {
            emit("edit", worldEventId);
          },
          onDelete: (worldEventId) => {
            emit("delete", worldEventId);
          },
        }),
      );
    },
  },
];

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});

const table = useVueTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
  },
});
</script>

<template>
  <div class="w-full">
    <div class="flex items-center gap-2 py-4">
      <Input
        class="max-w-sm"
        placeholder="Search by name..."
        name="search"
        type="search"
        :model-value="table.getColumn('name')?.getFilterValue() as string"
        @update:model-value="table.getColumn('name')?.setFilterValue($event)"
      />
      <Button
        variant="outline"
        @click="$emit('create')"
        class="gap-2"
      >
        <CalendarPlus />
        New world event
      </Button>
    </div>
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template
              v-for="row in table.getRowModel().rows"
              :key="row.id"
            >
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                >
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell
              :colspan="columns.length"
              class="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} of
        {{ table.getFilteredRowModel().rows.length }} row(s) selected.
      </div>
      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>
