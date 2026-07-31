import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

function PaginationNav({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-end", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-0.5", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      variant={isActive ? "outline" : "ghost"}
      size={size}
      className={cn(className)}
      nativeButton={false}
      render={
        <a
          aria-current={isActive ? "page" : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          {...props}
        />
      }
    />
  )
}

function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("pl-1.5!", className)}
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:block">{text}</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("pr-1.5!", className)}
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More pages</span>
    </span>
  )
}

const ROWS_OPTIONS = [10, 20, 50, 100]

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  perPage: number
  onPerPageChange: (perPage: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange, perPage, onPerPageChange }: PaginationProps) {
  if (totalPages <= 1 && perPage >= 10) return null

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    const delta = 1
    const start = Math.max(2, currentPage - delta)
    const end = Math.min(totalPages - 1, currentPage + delta)

    pages.push(1)
    if (start > 2) pages.push("ellipsis")
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages - 1) pages.push("ellipsis")
    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  return (
    <div className="flex items-center justify-between gap-4 mt-4 w-full">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Label htmlFor="rows-per-page" className="text-sm text-muted-foreground whitespace-nowrap">
          Baris per halaman
        </Label>
        <select
          id="rows-per-page"
          value={perPage}
          onChange={(e) => { onPerPageChange(Number(e.target.value)); onPageChange(1) }}
          className="flex h-8 w-16 items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {ROWS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <PaginationNav>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => { e.preventDefault(); if (currentPage > 1) onPageChange(currentPage - 1) }}
              className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
              text="Sebelumnya"
            />
          </PaginationItem>
          {getPageNumbers().map((page, idx) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={(e) => { e.preventDefault(); onPageChange(page) }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) onPageChange(currentPage + 1) }}
              className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}
              text="Selanjutnya"
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationNav>
    </div>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
