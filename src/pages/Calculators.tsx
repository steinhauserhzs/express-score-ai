import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  PiggyBank, 
  TrendingUp, 
  CreditCard, 
  DollarSign,
  Percent
} from "lucide-react";

export default function Calculators() {
  // Emergency Fund Calculator
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [emergencyMonths, setEmergencyMonths] = useState("6");

  // Debt Payoff Calculator
  const [debtAmount, setDebtAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");

  // Compound Interest Calculator
  const [initialInvestment, setInitialInvestment] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [annualReturn, setAnnualReturn] = useState("10");
  const [years, setYears] = useState("10");

  // Retirement Calculator
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("65");
  const [currentSavings, setCurrentSavings] = useState("");
  const [desiredMonthlyIncome, setDesiredMonthlyIncome] = useState("");

  const calculateEmergencyFund = () => {
    const expenses = parseFloat(monthlyExpenses);
    const months = parseFloat(emergencyMonths);
    if (isNaN(expenses) || isNaN(months)) return null;
    return expenses * months;
  };

  const calculateDebtPayoff = () => {
    const debt = parseFloat(debtAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const payment = parseFloat(monthlyPayment);
    
    if (isNaN(debt) || isNaN(rate) || isNaN(payment)) return null;
    
    if (payment <= debt * rate) {
      return { months: Infinity, totalPaid: Infinity, totalInterest: Infinity };
    }
    
    let balance = debt;
    let months = 0;
    let totalPaid = 0;
    
    while (balance > 0 && months < 600) {
      const interest = balance * rate;
      const principal = Math.min(payment - interest, balance);
      balance -= principal;
      totalPaid += principal + interest;
      months++;
    }
    
    return {
      months,
      totalPaid,
      totalInterest: totalPaid - debt
    };
  };

  const calculateCompoundInterest = () => {
    const principal = parseFloat(initialInvestment);
    const monthly = parseFloat(monthlyContribution);
    const rate = parseFloat(annualReturn) / 100;
    const time = parseFloat(years);
    
    if (isNaN(principal) || isNaN(monthly) || isNaN(rate) || isNaN(time)) return null;
    
    const monthlyRate = rate / 12;
    const months = time * 12;
    
    // Future value of initial investment
    const fvInitial = principal * Math.pow(1 + monthlyRate, months);
    
    // Future value of monthly contributions
    const fvMonthly = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    
    const total = fvInitial + fvMonthly;
    const invested = principal + (monthly * months);
    const earnings = total - invested;
    
    return { total, invested, earnings };
  };

  const calculateRetirement = () => {
    const age = parseFloat(currentAge);
    const retAge = parseFloat(retirementAge);
    const savings = parseFloat(currentSavings);
    const monthlyIncome = parseFloat(desiredMonthlyIncome);
    
    if (isNaN(age) || isNaN(retAge) || isNaN(savings) || isNaN(monthlyIncome)) return null;
    
    const yearsToRetirement = retAge - age;
    const monthsToRetirement = yearsToRetirement * 12;
    
    // Assuming 4% withdrawal rate (25x annual expenses rule)
    const neededCapital = monthlyIncome * 12 * 25;
    const shortfall = Math.max(0, neededCapital - savings);
    
    // Calculate monthly contribution needed (assuming 8% annual return)
    const monthlyRate = 0.08 / 12;
    const fvSavings = savings * Math.pow(1 + monthlyRate, monthsToRetirement);
    const remainingNeeded = Math.max(0, neededCapital - fvSavings);
    
    let monthlyNeeded = 0;
    if (remainingNeeded > 0) {
      monthlyNeeded = remainingNeeded / ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate);
    }
    
    return {
      neededCapital,
      yearsToRetirement,
      monthlyNeeded,
      projectedValue: fvSavings + (monthlyNeeded * ((Math.pow(1 + monthlyRate, monthsToRetirement) - 1) / monthlyRate))
    };
  };

  const emergencyResult = calculateEmergencyFund();
  const debtResult = calculateDebtPayoff();
  const compoundResult = calculateCompoundInterest();
  const retirementResult = calculateRetirement();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Calculadoras Financeiras</h1>
          <p className="text-muted-foreground">
            Ferramentas para ajudar no seu planejamento financeiro
          </p>
        </div>

        <Tabs defaultValue="emergency" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="emergency">Reserva</TabsTrigger>
            <TabsTrigger value="debt">Dívidas</TabsTrigger>
            <TabsTrigger value="compound">Juros</TabsTrigger>
            <TabsTrigger value="retirement">Aposentadoria</TabsTrigger>
            <TabsTrigger value="effective">Taxa</TabsTrigger>
          </TabsList>

          {/* Emergency Fund Calculator */}
          <TabsContent value="emergency">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PiggyBank className="h-6 w-6 text-primary" />
                  <CardTitle>Calculadora de Reserva de Emergência</CardTitle>
                </div>
                <CardDescription>
                  Descubra quanto você precisa guardar para sua segurança financeira
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyExpenses">Despesas Mensais (R$)</Label>
                    <Input
                      id="monthlyExpenses"
                      type="number"
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(e.target.value)}
                      placeholder="3000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyMonths">Meses de Cobertura</Label>
                    <Input
                      id="emergencyMonths"
                      type="number"
                      value={emergencyMonths}
                      onChange={(e) => setEmergencyMonths(e.target.value)}
                      placeholder="6"
                    />
                  </div>
                </div>

                {emergencyResult && (
                  <div className="p-6 bg-primary/10 rounded-lg">
                    <h3 className="font-semibold mb-2">Resultado:</h3>
                    <div className="text-3xl font-bold text-primary">
                      R$ {emergencyResult.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Esta é a quantia que você deve ter guardada para cobrir {emergencyMonths} meses de despesas
                    </p>
                  </div>
                )}

                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>💡 Dica:</strong> O ideal é ter entre 3 a 6 meses de despesas guardadas.</p>
                  <p><strong>📊 Recomendação:</strong> Mantenha em aplicações de liquidez imediata como Tesouro Selic ou CDB com liquidez diária.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Debt Payoff Calculator */}
          <TabsContent value="debt">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <CardTitle>Calculadora de Quitação de Dívidas</CardTitle>
                </div>
                <CardDescription>
                  Descubra em quanto tempo você quitará sua dívida
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="debtAmount">Valor da Dívida (R$)</Label>
                    <Input
                      id="debtAmount"
                      type="number"
                      value={debtAmount}
                      onChange={(e) => setDebtAmount(e.target.value)}
                      placeholder="5000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Taxa de Juros (% ao ano)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="15"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyPayment">Pagamento Mensal (R$)</Label>
                    <Input
                      id="monthlyPayment"
                      type="number"
                      value={monthlyPayment}
                      onChange={(e) => setMonthlyPayment(e.target.value)}
                      placeholder="500"
                    />
                  </div>
                </div>

                {debtResult && debtResult.months !== Infinity && (
                  <div className="p-6 bg-primary/10 rounded-lg space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Tempo para Quitar:</h3>
                      <div className="text-3xl font-bold text-primary">
                        {Math.ceil(debtResult.months)} meses
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ({(debtResult.months / 12).toFixed(1)} anos)
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Pago:</p>
                        <p className="text-xl font-bold">
                          R$ {debtResult.totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Juros Pagos:</p>
                        <p className="text-xl font-bold text-destructive">
                          R$ {debtResult.totalInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {debtResult && debtResult.months === Infinity && (
                  <div className="p-6 bg-destructive/10 rounded-lg border border-destructive">
                    <p className="font-semibold text-destructive">
                      ⚠️ Atenção: O pagamento mensal é insuficiente para cobrir os juros!
                    </p>
                    <p className="text-sm mt-2">
                      Você precisa pagar mais que os juros mensais para começar a reduzir a dívida.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compound Interest Calculator */}
          <TabsContent value="compound">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <CardTitle>Calculadora de Juros Compostos</CardTitle>
                </div>
                <CardDescription>
                  Veja o poder dos juros compostos nos seus investimentos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="initialInvestment">Investimento Inicial (R$)</Label>
                    <Input
                      id="initialInvestment"
                      type="number"
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(e.target.value)}
                      placeholder="10000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyContribution">Aporte Mensal (R$)</Label>
                    <Input
                      id="monthlyContribution"
                      type="number"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(e.target.value)}
                      placeholder="500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annualReturn">Retorno Anual (%)</Label>
                    <Input
                      id="annualReturn"
                      type="number"
                      value={annualReturn}
                      onChange={(e) => setAnnualReturn(e.target.value)}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="years">Período (anos)</Label>
                    <Input
                      id="years"
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      placeholder="10"
                    />
                  </div>
                </div>

                {compoundResult && (
                  <div className="p-6 bg-primary/10 rounded-lg space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Valor Final:</h3>
                      <div className="text-3xl font-bold text-primary">
                        R$ {compoundResult.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Investido:</p>
                        <p className="text-xl font-bold">
                          R$ {compoundResult.invested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rendimento:</p>
                        <p className="text-xl font-bold text-success">
                          R$ {compoundResult.earnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>💡 Dica:</strong> Quanto mais cedo começar, maior será o efeito dos juros compostos!</p>
                  <p><strong>📊 Referência:</strong> CDI médio ~13% ao ano, IPCA+6% ~11% ao ano (dados históricos)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Retirement Calculator */}
          <TabsContent value="retirement">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-primary" />
                  <CardTitle>Calculadora de Aposentadoria</CardTitle>
                </div>
                <CardDescription>
                  Planeje quanto você precisa poupar para se aposentar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentAge">Idade Atual</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      value={currentAge}
                      onChange={(e) => setCurrentAge(e.target.value)}
                      placeholder="30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retirementAge">Idade de Aposentadoria</Label>
                    <Input
                      id="retirementAge"
                      type="number"
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(e.target.value)}
                      placeholder="65"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentSavings">Economias Atuais (R$)</Label>
                    <Input
                      id="currentSavings"
                      type="number"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(e.target.value)}
                      placeholder="50000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desiredMonthlyIncome">Renda Mensal Desejada (R$)</Label>
                    <Input
                      id="desiredMonthlyIncome"
                      type="number"
                      value={desiredMonthlyIncome}
                      onChange={(e) => setDesiredMonthlyIncome(e.target.value)}
                      placeholder="5000"
                    />
                  </div>
                </div>

                {retirementResult && (
                  <div className="p-6 bg-primary/10 rounded-lg space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Aporte Mensal Necessário:</h3>
                      <div className="text-3xl font-bold text-primary">
                        R$ {retirementResult.monthlyNeeded.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Durante {retirementResult.yearsToRetirement} anos até sua aposentadoria
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Capital Necessário:</p>
                        <p className="text-xl font-bold">
                          R$ {retirementResult.neededCapital.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Projetado:</p>
                        <p className="text-xl font-bold text-success">
                          R$ {retirementResult.projectedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>💡 Metodologia:</strong> Baseado na regra dos 4% (25x as despesas anuais)</p>
                  <p><strong>📊 Premissa:</strong> Retorno real de 8% ao ano acima da inflação</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Effective Rate Calculator */}
          <TabsContent value="effective">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Percent className="h-6 w-6 text-primary" />
                  <CardTitle>Calculadora de Taxa Efetiva</CardTitle>
                </div>
                <CardDescription>
                  Compare a taxa real de diferentes opções de crédito
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-muted rounded-lg text-center">
                  <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Em breve...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}