package app.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                // Allow POST requests to /public without authentication
                .requestMatchers(HttpMethod.POST, "/submit").permitAll()
                // Allow GET requests to /public as well
                .requestMatchers(HttpMethod.GET, "/submit").permitAll()
                .anyRequest().permitAll()).csrf(csrf -> csrf.disable());
            // .cors(...) weglassen → oder siehe unten

        return http.build();
    }

    // Separate CORS-Bean – das ist sauberer und funktioniert zuverlässig
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
            "http://localhost:8080", 
            "http://localhost:5173",   // Vite-Standard
            "http://localhost:5174"    // falls du einen anderen Port hast
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);   // falls du später Cookies brauchst
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}