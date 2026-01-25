package com.vedavyaas.apigatewayservice.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.List;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebFluxSecurity
public class JWTConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http.csrf(ServerHttpSecurity.CsrfSpec::disable);
        http.cors(Customizer.withDefaults()); // Enable CORS
        http.oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()));
        http.authorizeExchange(exchange -> exchange.pathMatchers("/eureka/**", "AUTHSERVICE/create/account/**", "AUTHSERVICE/authenticate/**", "AUTHSERVICE/forget/password/**", "/messagingservice/ws/**", "/MESSAGINGSERVICE/ws/**").permitAll());
        http.authorizeExchange(exchange -> exchange.anyExchange().authenticated());

        return http.build();
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(List.of("http://localhost:5173"));
        corsConfig.setMaxAge(3600L);
        corsConfig.addAllowedMethod("*");
        corsConfig.addAllowedHeader("*");
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }

    @Bean
    RSAPublicKey rsaPublicKey(){
        return loadPublicKeyFromPem("keys/jwt-public.pem");
    }

    @Bean
    ReactiveJwtDecoder jwtDecoder(RSAPublicKey rsaPublicKey){
        return new NimbusReactiveJwtDecoder(rsaPublicKey);
    }

    private static RSAPublicKey loadPublicKeyFromPem(String classpathLocation) {
        try {
            byte[] pemBytes = new ClassPathResource(classpathLocation).getContentAsByteArray();
            String pem = new String(pemBytes, StandardCharsets.US_ASCII);
            String base64 = pem
                    .replace("-----BEGIN PUBLIC KEY-----", "")
                    .replace("-----END PUBLIC KEY-----", "")
                    .replaceAll("\\s", "");
            byte[] der = Base64.getDecoder().decode(base64);
            X509EncodedKeySpec spec = new X509EncodedKeySpec(der);
            KeyFactory kf = KeyFactory.getInstance("RSA");
            return (RSAPublicKey) kf.generatePublic(spec);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to load RSA public key from classpath: " + classpathLocation, e);
        }
    }
}