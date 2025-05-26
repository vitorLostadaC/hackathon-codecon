import React from 'react'
import { Button } from '../components/Button'
import { cn } from '@renderer/lib/utils'
import { HandCoins, Mail } from 'lucide-react'

interface PricingPlan {
  id: number
  name: string
  price: string
  credits: number
  features: string[]
  isHighlighted?: boolean
}

interface PricingTabProps {
  selectedPlan: number
  onPlanSelect: (planId: number) => void
}

export function PricingTab({ selectedPlan, onPlanSelect }: PricingTabProps): React.JSX.Element {
  const plans: PricingPlan[] = [
    {
      id: 1,
      name: 'Basic',
      price: 'R$ 9,90',
      credits: 50,
      features: []
    },
    {
      id: 2,
      name: 'Premium',
      price: 'R$ 9,90',
      credits: 50,
      features: [],
      isHighlighted: true
    },
    {
      id: 4,
      name: 'Basic',
      price: 'R$ 9,90',
      credits: 50,
      features: []
    },
    {
      id: 3,
      name: 'Ultra master premium',
      price: 'R$ 149,90',
      credits: 50,
      features: ['Email customizado com chuva de ofensas']
    }
  ]

  return (
    <div className="flex gap-3 flex-wrap mx-4">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={cn(
            'flex-1 min-w-[159px] p-4 px-[14px] rounded-lg border relative overflow-hidden',
            plan.isHighlighted ? 'border-border-primary' : 'border-border-secondary'
          )}
        >
          {plan.isHighlighted && (
            <>
              <div className="absolute z-0 -top-5 -left-14 w-[100px] h-[20px] rotate-[45deg] rounded-full bg-accent-secondary opacity-80 blur-[6px]" />
              <div className="absolute z-0 -top-6 -left-16 w-[140px] h-[40px] rotate-[50deg] rounded-full bg-accent-secondary opacity-35 blur-[10px]" />
            </>
          )}
          <div className="space-y-[22px] relative z-10">
            <h3 className="text-primary leading-[1.0] text-xl">{plan.name}</h3>
            <div className="space-y-5">
              <span className="text-primary text-2xl leading-[1.0] font-semibold block">
                {plan.price}
              </span>
              <div className="flex justify-between">
                <div className="flex items-center gap-1.5 text-secondary">
                  <HandCoins size={16} />
                  <span className="text-sm">{plan.credits} créditos</span>
                </div>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-secondary gap-1.5">
                    <Mail size={16} />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button
            variant={plan.isHighlighted ? 'primary' : 'secondary'}
            onClick={() => onPlanSelect(plan.id)}
            fullWidth
            className="mt-7"
          >
            {selectedPlan === plan.id ? 'Selecionado' : 'Escolher'}
          </Button>
        </div>
      ))}
    </div>
  )
}
