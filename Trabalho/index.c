#include <stdio.h>
#include <stdlib.h>
#include <time.h>

// Função para simular a leitura da temperatura do freezer
float lerTemperatura() {
    // Simulação de temperatura entre -20 e 10 graus Celsius
    return (rand() % 31) - 20;
}

// Função para monitorar a temperatura e alertar se estiver fora do intervalo seguro
void monitorarTemperatura(float temperaturaMin, float temperaturaMax) {
    float temperaturaAtual = lerTemperatura();
    printf("Temperatura atual: %.2f°C\n", temperaturaAtual);

    if (temperaturaAtual < temperaturaMin || temperaturaAtual > temperaturaMax) {
        printf("Alerta: Temperatura fora do intervalo seguro!\n");
    } else {
        printf("Temperatura dentro do intervalo seguro.\n");
    }
}

int main() {
    // Semente para geração de números aleatórios
    srand(time(0));

    // Definindo o intervalo seguro de temperatura
    float temperaturaMin = -18.0;
    float temperaturaMax = -10.0;

    // Monitorar a temperatura a cada 5 segundos
    while (1) {
        monitorarTemperatura(temperaturaMin, temperaturaMax);
        sleep(5); // Pausa de 5 segundos
    }

    return 0;
}