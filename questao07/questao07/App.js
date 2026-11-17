import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

function moeda(valor) {
  const [inteiro, decimal] = valor.toFixed(2).split('.');
  return `R$ ${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimal}`;
}

function converter(texto) {
  const limpo = texto.trim().replace(',', '.');
  if (limpo === '') return NaN;
  return Number(limpo);
}

export default function App() {
  const [produto, setProduto] = useState('');
  const [preco, setPreco] = useState('');
  const [percentual, setPercentual] = useState('');
  const [erro, setErro] = useState('');
  const [resultado, setResultado] = useState(null);

  function aplicarDesconto() {
    if (produto.trim() === '') {
      setResultado(null);
      setErro('Informe o nome do produto.');
      return;
    }

    const valorPreco = converter(preco);
    if (Number.isNaN(valorPreco)) {
      setResultado(null);
      setErro('Informe um preço válido. Exemplo: 200 ou 199,90.');
      return;
    }
    if (valorPreco < 0) {
      setResultado(null);
      setErro('O preço não pode ser negativo.');
      return;
    }

    const valorDesconto = converter(percentual);
    if (Number.isNaN(valorDesconto)) {
      setResultado(null);
      setErro('Informe um percentual de desconto válido.');
      return;
    }
    if (valorDesconto < 0 || valorDesconto > 100) {
      setResultado(null);
      setErro('O desconto deve estar entre 0% e 100%.');
      return;
    }

    const economia = (valorPreco * valorDesconto) / 100;
    const precoFinal = valorPreco - economia;

    setErro('');
    setResultado({
      produto: produto.trim(),
      original: valorPreco,
      percentual: valorDesconto,
      economia,
      precoFinal,
    });
  }

  function limpar() {
    setProduto('');
    setPreco('');
    setPercentual('');
    setErro('');
    setResultado(null);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Calculadora de desconto</Text>
        <Text style={styles.subtitulo}>Veja quanto você economiza na compra.</Text>

        <Text style={styles.label}>Produto</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex.: Fone de ouvido"
          placeholderTextColor="#9a9a9a"
          value={produto}
          onChangeText={setProduto}
        />

        <View style={styles.linha}>
          <View style={styles.coluna}>
            <Text style={styles.label}>Preço original (R$)</Text>
            <TextInput
              style={styles.input}
              placeholder="200,00"
              placeholderTextColor="#9a9a9a"
              keyboardType="decimal-pad"
              value={preco}
              onChangeText={setPreco}
            />
          </View>
          <View style={styles.coluna}>
            <Text style={styles.label}>Desconto (%)</Text>
            <TextInput
              style={styles.input}
              placeholder="15"
              placeholderTextColor="#9a9a9a"
              keyboardType="decimal-pad"
              value={percentual}
              onChangeText={setPercentual}
            />
          </View>
        </View>

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

        <View style={styles.botoes}>
          <Pressable
            style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
            onPress={aplicarDesconto}
          >
            <Text style={styles.botaoTexto}>Aplicar desconto</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.botao,
              styles.botaoSecundario,
              pressed && styles.pressionado,
            ]}
            onPress={limpar}
          >
            <Text style={[styles.botaoTexto, styles.botaoSecundarioTexto]}>Limpar</Text>
          </Pressable>
        </View>

        {resultado && (
          <View style={styles.cartao}>
            <Text style={styles.cartaoProduto}>{resultado.produto}</Text>
            <Text style={styles.cartaoLinha}>
              Preço original: {moeda(resultado.original)}
            </Text>
            <Text style={styles.cartaoLinha}>
              Desconto de {String(resultado.percentual).replace('.', ',')}%
            </Text>
            <Text style={styles.cartaoEconomia}>
              Você economiza {moeda(resultado.economia)}
            </Text>
            <Text style={styles.cartaoLabel}>Preço final</Text>
            <Text style={styles.cartaoFinal}>{moeda(resultado.precoFinal)}</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff6f2' },
  container: { padding: 24, paddingTop: 56 },
  titulo: { fontSize: 28, fontWeight: '700', color: '#4a1d12' },
  subtitulo: { fontSize: 15, color: '#8a5a4c', marginTop: 4, marginBottom: 24 },
  label: { fontSize: 15, fontWeight: '600', color: '#4a1d12', marginBottom: 6 },
  linha: { flexDirection: 'row', gap: 12, marginTop: 16 },
  coluna: { flex: 1 },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#efd5cb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    color: '#4a1d12',
  },
  erro: { color: '#b3261e', marginTop: 12, fontSize: 14 },
  botoes: { flexDirection: 'row', gap: 12, marginTop: 20 },
  botao: {
    flex: 1,
    backgroundColor: '#d4472a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  pressionado: { opacity: 0.8 },
  botaoTexto: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  botaoSecundario: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#d4472a',
  },
  botaoSecundarioTexto: { color: '#d4472a' },
  cartao: {
    marginTop: 28,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#efd5cb',
  },
  cartaoProduto: { fontSize: 20, fontWeight: '700', color: '#4a1d12', marginBottom: 8 },
  cartaoLinha: { fontSize: 15, color: '#8a5a4c' },
  cartaoEconomia: { fontSize: 17, fontWeight: '600', color: '#2e7d4f', marginTop: 10 },
  cartaoLabel: { fontSize: 14, color: '#8a5a4c', marginTop: 14 },
  cartaoFinal: { fontSize: 40, fontWeight: '700', color: '#d4472a' },
});