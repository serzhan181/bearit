"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ComboboxOption } from "@/components/ui/combobox";
import Image from "next/image";

export interface ComboboxWithImageOption extends ComboboxOption {
  imageUrl?: string;
}

interface ComboboxWithImageProps {
  placeholder?: string;
  options: ComboboxWithImageOption[];
  value: string;
  onChange: (val: string) => void;
}

export function ComboboxWithImage({
  placeholder,
  options,
  onChange,
  value,
}: ComboboxWithImageProps) {
  const [open, setOpen] = React.useState(false);

  const currentOption = options.find((o) => o.value === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? (
            <div className="flex gap-2">
              <div className={cn("relative mr-2 h-6 w-6")}>
                {currentOption?.imageUrl && (
                  <Image
                    fill
                    src={currentOption.imageUrl}
                    alt={currentOption.label}
                    className="rounded-full"
                  />
                )}
              </div>
              {currentOption?.label}
            </div>
          ) : (
            placeholder || "Select..."
          )}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>Nothing found.</CommandEmpty>
          <CommandGroup>
            {options.map((o) => (
              <CommandItem
                key={o.value}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
                value={o.value}
              >
                <div className={cn("relative mr-2 h-5 w-5")}>
                  {o.imageUrl && (
                    <Image
                      fill
                      src={o.imageUrl}
                      alt={o.label}
                      className="rounded-full"
                    />
                  )}
                </div>
                {o.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
