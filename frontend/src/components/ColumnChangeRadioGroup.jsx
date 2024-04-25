"use client"

import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"



export function ColumnChangeRadioGroup() {

  const form = useForm()

  // TODO: will have to preserve state as the user makes more lists(columns)
  const playPileColumns = ["Backlog", "PlanToPlay", "Playing", "Done"]

  function onSubmit(data) {
    console.log('onSubmit -> data', data.type)
    toast({
      title: `Moved game to list ${data.type}!`,
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })

    //Where we will update the list(column) of the game
    // updateUserGame(igdbId, {columnId: 'newColumnId'})
    // rerender the column list that the game is now in, if it ison the PP board
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Lists </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {playPileColumns.map((column) => {
                    return (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={column} />
                        </FormControl>
                        <FormLabel className="font-normal">{column}</FormLabel>
                      </FormItem>
                    )
                  })}

                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Move</Button>

      </form>
    </Form>
  )
}

export default ColumnChangeRadioGroup;