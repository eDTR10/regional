"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"



export function ComboboxDemo({users}:any) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <div className=" flex flex-col gap-2 w-full">
    <p className="  text-foreground">Select employee's name</p>
    
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between  text-foreground"
        >
          {value
            ? users.find((employee:any) => employee.full_name === value)?.full_name
            : "Select employee..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" w-[300px] p-0 ">
        <Command>
          <CommandInput placeholder="Search employee..." className="h-9 w-full" />
          <CommandList>
            <CommandEmpty>No Employee found</CommandEmpty>
            <CommandGroup>
              {users.map((employee:any) => (
                <CommandItem
                  key={employee.uid}
                  value={employee.full_name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                   
                    localStorage.setItem('selectedID',employee.uid)
                    
                    localStorage.setItem('selectedName',employee.full_name)

                    
                    setOpen(false)
                  }}
                >
                  {employee.full_name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === employee.full_name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover></div>
  )
}
