import { Plus, X } from 'phosphor-react'
import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react';
import logoImage from '../assets/habitlogo.svg';
import { NewHabitForm } from './NewHabitForm';

export function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="w-full max-w-3xl mx-auto mb-9 flex items-center justify-between">
            <img src={logoImage} alt="Habits" />

            <Dialog.Root>
                <Dialog.Trigger
                    type='button'
                    className='border-violet-500 border font-semibold rounded-lg px-6 py-4 flex gap-3 items-center
                    hover:bg-violet-300 hover:text-black duration-300 ease-in-out transition-colors focus:outline-none focus:ring-2 focus:ring-violet-900 focus:ring-offset-2 focus:ring-offset-background'
                >
                    <Plus size={20} />
                    Novo hábito
                </Dialog.Trigger>

                <Dialog.Portal>
                    <Dialog.Overlay className='w-screen h-screen bg-black/80 fixed inset-0' />

                    <Dialog.Content className='absolute p-10 bg-zinc-900 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                        <Dialog.Close className='absolute right-6 top-6 text-zinc-400 hover:text-zinc-200 cursor-pointer'>
                            <X size={24} aria-label="Fechar" />
                        </Dialog.Close>

                        <Dialog.Title className='text-3xl leading-tight font-extrabold'>
                            Criar hábito
                        </Dialog.Title>

                        <NewHabitForm />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

        </div>
    )
}